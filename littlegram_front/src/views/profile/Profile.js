import './Profile.css';

import { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Menu from '../../components/menu/Menu.js'
import config from '../../config';
import axios from 'axios'
import ImageFilter from 'react-image-filter';
import TresPontos from '../../assets/imgs/tres-pontos.svg'
import { useNavigate, useParams } from 'react-router-dom';
import Trash from '../../assets/imgs/trash.svg'
import likeImg from '../../assets/imgs/like.svg'
import fullLikeImg from '../../assets/imgs/fullLike.svg'
import X from '../../assets/imgs/x.svg'
import lixo from '../../assets/imgs/lixo.svg'

function Profile() {
  const { id } = useParams();

  // Controladores da requisição
  const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);

  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [offSetPosts, setOffSetPosts] = useState(0);
  const [offSetPhotos, setOffSetPhotos] = useState(0);

  const [posts, setPosts] = useState([])

  //modal selecionar imagem
  const [openNewPost, setOpenNewPost] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [photos, setPhotos] = useState([])

  //modal selecionar filtro
  const [openFilter, setOpenFilter] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState(0)
  const [descricao, setDescricao] = useState('')

  // modal delete
  const [openDelete, setOpenDelete] = useState(false)

  //modal ver comentários
  const [selectedViewComments, setSelectedViewComments] = useState(null)
  const [openComments, setOpenComments] = useState(false)

  //modal para o comentário
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [commentPost, setCommentPost] = useState('');
  const [offsetComment, setOffsetComment] = useState(0);
  const [comments, setComments] = useState([]);
  const [openDeleteComment, setOpenDeleteComment] = useState(false);
  const [commentIdDel, setCommentIdDel] = useState('');
  const [openDeleteAllComment, setOpenDeleteAllComment] = useState(false);

  //modal 3 pontos
  const [openModal3Pontos, setOpenModal3Pontos] = useState(false);

  const [selectedExclude, setSelectedExclude] = useState(null)

  const navigate = useNavigate()

  function getPosts() {
    setIsFetchingPosts(true);
    axios.get(config.baseURL + "/posts/user/" + id + "?limit=10&offset=" + offSetPosts, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response.data)
      
      setPosts(posts.concat(response.data.posts));

      if (offSetPosts + 1 >= response.data.totalPages || response.data.posts === []) return
      setOffSetPosts(offSetPosts + 1); // Usando a função de atualização do estado para obter o valor mais recente de 'page'
      setIsFetchingPosts(false);


    }).catch((error) => {
      if(error.response.status === 401){
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('avatar')
      }
    })
  }

  const getPhotos = () => {
    setIsFetchingPhotos(true);
    axios.get(config.baseURL + "/photos/user/?limit=10&offset=" + offSetPhotos, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {

      if (offSetPhotos + 1 > response.data.totalPages || response.data.photos === []) return

      setOffSetPhotos(prevPage => prevPage + 1);
      setIsFetchingPhotos(false);
      setPhotos(photos.concat(response.data.photos));
    }).catch((error) => {
      if (error['response']['data']['message'] === ["No photos found for this user."]) {
        setPhotos([])
      } 
       if( error.response.status === 401){
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('avatar')
      }
    })
  }

  const uploadPost = () => {
    axios.post(config.baseURL + "/posts/", {
      photoId: photos[selectedImage].id,
      description: descricao,
      filterUsed: String(selectedFilter)
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        setOpenFilter(false)
        navigate(0)
      }
    })
  }

  const createLike = (postId, likeV) => {
    axios.post(config.baseURL + "/posts-evaluations/", {
      isLike: likeV,
      postId: postId
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        navigate(0)
      }
    }).catch((response) => {
    })
  }

  const createCommentLike = (Id, likeV) => {
    axios.post(config.baseURL + "/comments-evaluations/", {
      isLike: likeV,
      commentId: Id
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        navigate(0)
      }
    }).catch((response) => {
    })
  }

  const createComment = (postId, comment) => {
    axios.post(config.baseURL + "/comments/", {
      text: comment,
      postId: postId
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        navigate(0)
      }
    })
  }

  const getComments = (postId) => {
    setIsFetchingComments(true);
    axios.get(config.baseURL + "/comments/post/" + postId + "?limit=10&offset=" + offsetComment, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        if (offsetComment + 1 > response.data.totalPages || response.data.comments === []) return

        setOffsetComment(prevPage => prevPage + 1);
        setIsFetchingComments(false);
        setComments(comments.concat(response.data.comments));
      }
    })
  }

  const deleteComment = (postId, commentId) => {
    axios.delete(config.baseURL + "/comments/?postId=" + postId + "&commentId=" + commentId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        navigate(0)
      }
    })
  }

  const validComment = (comment) => {
    return comment.trim() === '';
  }

  const deleteAllComment = (postId) => {
    axios.delete(config.baseURL + "/comments/post/?postId=" + postId, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      if (response.status === 200) {
        navigate(0)
      }
    })
  }

  // Quando o scroll de posts se move
  const handleScrollPosts = (event) => {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100 && !isFetchingPosts) {
      getPosts()
    }
  }

  // Quando o scrool de photos se move
  const handleScrollPhotos = (event) => {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100 && !isFetchingPhotos) {
      getPhotos()
    }
  }

  // Quando o scroll de comentários se move
  const handleScrollComments = (event, postId) => {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100 && !isFetchingComments) {
      getComments(postId)
    }
  }

  const deletePost = (postId) => {
    axios.delete(config.baseURL + "/posts/?postId=" + postId, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }).then((response) => {
      if (response.status === 200) {
        setOpenDelete(openDelete ? false : true)
        navigate(0)
      }
    }).catch((error) => {
    })
  }
  useEffect(() => {
    getPosts()
  }, [])

  const returnBackground = (url) => {
    var part1 = "url("
    var part2 = url === "" ? "" : config.baseURL + '/files/avatar/' + url
    var part3 = ")  center/cover"
    return part1 + part2 + part3
  }
  const returnData = (date) => {
    var datePost = new Date(date)
    const meses = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];
    return datePost.getDate() + ' de ' + meses[datePost.getMonth()] + ' de ' + datePost.getFullYear() + ' às ' + datePost.getUTCHours()+ ':' + datePost.getUTCMinutes()+ ':'  + datePost.getUTCSeconds()
  }
  return (

    <>
      <div className="Container">
        <Menu />
        <div className='PostDashBoard'>
          <div style={{ width: '100%', padding: 15, textAlign: 'center' }}><button onClick={() => { setOpenNewPost(true); getPhotos() }} className='ButtonPhoto'>Adicionar Post</button></div>
          <div className='ListViews' onScroll={handleScrollPosts} >
            {posts.length > 0 && posts.map((post, index) => (
              <div key={index} className='DashPhoto' style={{ paddingTop: 0 }}>
                <div className='PostHeader'>
                  <div style={{ cursor: 'pointer', display: 'flex' }} onClick={() => { navigate('/profile/' + post.user.id) }}>
                    <div style={{ background: returnBackground(post.user.avatar), width: 40, height: 40, border: 'solid 1px white', margin: 'auto 0px' }} className='ImagePerfilMenu'  ></div>
                    <span style={{ color: 'white', fontSize: 18, fontWeight: 500, margin: 'auto 10px' }}>{'@' + post.user.username}</span>
                  </div>
                  <div style={{ width: 25, height: 30, position: 'absolute', right: 0, top: 10, display: post.user.id === localStorage.getItem('user_id') ? 'block' : 'none' }}><img style={{ width: '100%', cursor: 'pointer' }} src={TresPontos} onClick={() => {
                    setSelectedExclude(post.id);
                    setOpenModal3Pontos(true);
                  }} />
                  </div>
                </div>

                <ImageFilter
                  style={{ marginLeft: 50 }}
                  /*pq krls isso ta batendo?*/
                  image={config.baseURL + "/files/photos/" + post.photo.path}
                  filter={config.filtros[post.filterUsed].filter} // see docs beneath
                  colorOne={config.filtros[post.filterUsed].colorOne}
                  colorTwo={config.filtros[post.filterUsed].colorTwo}
                />

                <div className='LikeDiv'>
                  {post.userEvaluation === true && (
                    <img alt='like' className='LikeButtom' style={{ marginBottom: '7px' }} src={fullLikeImg} />
                  )}
                  {(post.userEvaluation === null || post.userEvaluation === false) && (
                    <img alt='like' className='LikeButtom' style={{ marginBottom: '7px' }} src={likeImg} onClick={() => {
                      createLike(post.id, true)
                    }} />
                  )}
                  <span className='ModalComments' style={{ padding: '0px 5px 0px' }}>{post.likes} likes</span>
                  {post.userEvaluation === false && (
                    <img alt='deslike' className='LikeButtom' style={{ rotate: '180deg' }} src={fullLikeImg} />
                  )}
                  {(post.userEvaluation === null || post.userEvaluation === true) && (
                    <img alt='deslike' className='LikeButtom' style={{ rotate: '180deg' }} src={likeImg} onClick={() => {
                      createLike(post.id, false)
                    }} />
                  )}
                  <span className='ModalComments' style={{ padding: '0px 5px 0px' }}>{post.dislikes} deslikes</span>
                </div>
                <span className='PostDescricao' >{post.description}</span>
                <div className='PostDescricao'>
                  <span className='PostDescricaoLetra' onClick={(event) => {
                    setOpenComments(true)
                    setSelectedViewComments(post.id)
                    getComments(post.id)
                  }}>ver os comentários</span>

                <span style={{cursor:'auto'}} className='PostDescricaoLetra'>{returnData(post.createdAt)}</span>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modais */}

      <Modal dialogClassName='ModalMaior' show={openNewPost} onHide={() => {
        setOpenNewPost(openNewPost ? false : true)
      }}>
        <Modal.Body onScroll={handleScrollPhotos} className='ModalMaior' style={{ backgroundColor: 'var(--color3)', maxHeight: '86vh', overflow: 'auto' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Novo Post:</h1>
          <h3 style={{ textAlign: 'left', color: 'white' }}>Selecione uma imagem</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', border: 'none' }} className='DashPhoto'>
            {photos.length > 0 && photos.map((photo, index) => (
              <div key={index} onClick={() => {
                setSelectedImage(index)
                setOpenNewPost(false)
                setOpenFilter(true)
              }} className='PhotoToPost' style={{ background: String('url(' + config.baseURL + "/files/photos/" + photo.path + ')' + 'center center / cover') }}>
              </div>
            ))}
          </div>

        </Modal.Body>
      </Modal>

      <Modal dialogClassName='ModalMaior' show={openNewPost} onHide={() => {
        setOpenNewPost(openNewPost ? false : true)
      }}>
        <Modal.Body onScroll={handleScrollPhotos} className='ModalMaior' style={{ backgroundColor: 'var(--color3)', maxHeight: '86vh', overflow: 'auto' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Novo Post:</h1>
          <h3 style={{ textAlign: 'left', color: 'white' }}>Selecione uma imagem</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', border: 'none' }} className='DashPhoto'>
            {photos.length > 0 && photos.map((photo, index) => (
              <div key={index} onClick={() => {
                setSelectedImage(index)
                setOpenNewPost(false)
                setOpenFilter(true)
              }} className='PhotoToPost' style={{ background: String('url(' + config.baseURL + "/files/photos/" + photo.path + ')' + 'center center / cover') }}>
              </div>
            ))}
          </div>

        </Modal.Body>
      </Modal>

      <Modal dialogClassName='ModalMaior' show={openFilter} onHide={() => {
        setOpenFilter(openFilter ? false : true)
        setSelectedFilter(0)
        setDescricao('')
      }}>
        <Modal.Body className='ModalMaior' style={{ backgroundColor: 'var(--color3)', maxHeight: '86vh', overflow: 'auto' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Novo Post:</h1>
          <h3 style={{ textAlign: 'left', color: 'white' }}>Selecione um filtro</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', border: 'none' }} className='DashPhoto'>


            <ImageFilter
              image={selectedImage !== null ? config.baseURL + "/files/photos/" + photos[selectedImage].path : ''}
              filter={config.filtros[selectedFilter].filter} // see docs beneath
              colorOne={config.filtros[selectedFilter].colorOne}
              colorTwo={config.filtros[selectedFilter].colorTwo}
            />
            <div className='FiltrosItens'> {config.filtros.map((filtro, index) => (<button key={index} style={{ opacity: index === selectedFilter ? 0.5 : 1 }} className='FiltroItem' onClick={() => {
              setSelectedFilter(index)
            }}>{filtro.name}</button>))}</div>
            <textarea maxLength={200} value={descricao} onChange={(event) => {
              setDescricao(event.target.value)
            }} rows={5} placeholder='Adicione aqui uma descrição' className='Descricao'></textarea>
            <button style={{ minWidth: 200 }} className='ButtonModal' onClick={() => { uploadPost() }}>Postar Imagem</button>
          </div>

        </Modal.Body>
      </Modal>
      <Modal show={openDelete} onHide={() => {
        setOpenDelete(openDelete ? false : true)
      }}>
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Deletar Post</h1>

          <img src={Trash} />
          <h1 style={{
            width: '100%', color: 'white', fontSize: '25px', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente esse post?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>


            <button className='ButtonModal' onClick={() => { deletePost(selectedExclude) }}>Sim</button>
            <button className='ButtonModal' onClick={() => {
              setOpenDelete(openDelete ? false : true)
            }}>Não</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openComments} dialogClassName='Modal' style={{ overflowY: "auto" }} size='xl' onHide={() => {
        setOpenComments(openComments ? false : true)
        setComments([])
        setOffsetComment(0)
        setIsFetchingComments(false)
        setCommentPost('')
      }}>
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <div className='FecharModal'>
            <img alt='fechar' style={{ width: '20px', filter: 'invert(100%)' }} src={X} onClick={() => {
              setOpenComments(openComments ? false : true)
            }} />
          </div>
          {posts.length > 0 && posts.map((post, index) => (
            post.id === selectedViewComments && (
              <div key={index} className='ModalPost'>
                <div className='ModalImage'>

                  <ImageFilter
                    id='ImagePostDetail'
                    image={config.baseURL + "/files/photos/" + post.photo.path}
                    filter={config.filtros[post.filterUsed].filter} // see docs beneath
                    colorOne={config.filtros[post.filterUsed].colorOne}
                    colorTwo={config.filtros[post.filterUsed].colorTwo}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className='ModalCommentsSide'>
                  <div className='ModalPostHeader'>
                    <div style={{ background: returnBackground(post.user.avatar), width: 40, height: 40, border: 'solid 1px white', margin: 'auto 0px' }} className='ImagePerfilMenu'  ></div>
                    <span className='ModalUserName'>{'@' + post.user.username}</span>
                  </div>
                  <span className='ModalDescription'>{post.description}</span>
                  <div className='DivScroolComments' onScroll={(event) => {
                    handleScrollComments(event, post.id)
                  }}>
                    {comments.length > 0 && comments.map((comment, index) => (
                      comment.postId === post.id && (
                        <div key={index} className='ModalCommentsDiv'>
                          <h1 className='ModalComments'>@{comment.user.username}</h1>
                          <div className='ModalCommentsBackSide'>
                            <h1 className='ModalComments'>{comment.text}</h1>
                            <div className='ModalLikeDiv'>

                              {comment.userEvaluation === true && (
                                <img alt='like' className='LikeButtom' style={{ marginBottom: '7px' }} src={fullLikeImg} />
                              )}
                              {(comment.userEvaluation === null || comment.userEvaluation === false) && (
                                <img alt='like' className='LikeButtom' style={{ marginBottom: '7px' }} src={likeImg} onClick={() => {
                                  createCommentLike(comment.id, true)
                                }} />
                              )}
                              <span className='ModalComments' style={{ padding: '0px 5px 0px' }}>{comment.likes}</span>
                              {comment.userEvaluation === false && (
                                <img alt='deslike' className='LikeButtom' style={{ rotate: '180deg' }} src={fullLikeImg} />
                              )}
                              {(comment.userEvaluation === null || comment.userEvaluation === true) && (
                                <img alt='deslike' className='LikeButtom' style={{ rotate: '180deg' }} src={likeImg} onClick={() => {
                                  createCommentLike(comment.id, false)
                                }} />
                              )}
                              <span className='ModalComments' style={{ padding: '0px 5px 0px' }}>{comment.dislikes}</span>
                              <img alt='trash' className='TrashButtom' src={lixo} onClick={() => {
                                setCommentIdDel(comment.id);
                                setOpenDeleteComment(true);
                              }} />
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  <textarea name='comentario' className='CommentBox' placeholder='Escreva um comentário' onChange={(event) => {
                    setCommentPost(event.target.value)
                  }}></textarea>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className='ButtonAddComment' onClick={() => {
                      validComment(commentPost) === false ? createComment(post.id, commentPost) : console.log();
                    }}>Adicionar comentário</button>
                  </div>
                </div>
              </div>
            )
          ))}
        </Modal.Body>
      </Modal>

      <Modal show={openDeleteComment} onHide={() => {
        setOpenDelete(openDeleteComment ? false : true)
      }}>
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Deletar comentário</h1>

          <img src={Trash} />
          <h1 style={{
            width: '100%', color: 'white', fontSize: '25px', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente esse comentário?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <button className='ButtonModal' onClick={() => {
              deleteComment(selectedViewComments, commentIdDel)
              setOpenDeleteComment(openDeleteComment ? false : true)
            }}>Sim</button>
            <button className='ButtonModal' onClick={() => {
              setOpenDeleteComment(openDeleteComment ? false : true)
            }}>Não</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModal3Pontos} onHide={() => {
        setOpenModal3Pontos(openModal3Pontos ? false : true)
      }}>
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <div className='Modal3Pontos'>
            <span className='BlockModal3Pontos' onClick={() => {
              setOpenDelete(true)
            }}>Deletar Post</span>
            <span className='BlockModal3Pontos' onClick={() => {
              setOpenDeleteAllComment(true)
            }}>Deletar todos os comentários</span>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openDeleteAllComment} onHide={() => {
        setOpenDeleteAllComment(openDeleteAllComment ? false : true)
      }}>
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Deletar todos os comentário?</h1>

          <img src={Trash} />
          <h1 style={{
            width: '100%', color: 'white', fontSize: '25px', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente todos os comentários desse post?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <button className='ButtonModal' onClick={() => {
              deleteAllComment(selectedExclude)
              setOpenDeleteAllComment(openDeleteAllComment ? false : true)
            }}>Sim</button>
            <button className='ButtonModal' onClick={() => {
              setOpenDeleteAllComment(openDeleteAllComment ? false : true)
            }}>Não</button>
          </div>
        </Modal.Body>
      </Modal>

    </>

  );
}

export default Profile;
