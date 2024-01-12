import './GerenciarFotos.css';
import { ProgressBar, Modal } from 'react-bootstrap';

import Trash from '../../assets/imgs/trash.svg'
import config from '../../config.js';
import Search from '../../assets/imgs/search.svg'
import Menu from '../../components/menu/Menu.js'
import { useState, useEffect } from 'react';
import Validators from '../Validators';
import Blank from './../../assets/imgs/404 error lost in space-amico.svg'

import instance from '../../api.js'
import ModalYesNo from '../../components/ModalYesNo/ModalYesNo.js';
import utilities from '../utilities.js';
import ToastError from '../../components/ToastError/ToastError.js';


function GerenciarFotos() {
  const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);
  // Controlar upload
  const [progress, setProgress] = useState(0)

  const [offSetPhotos, setOffSetPhotos] = useState(0);
  // variaives extras
  const [selectedExclude, setSelectedExclude] = useState({})
  const [imageError, setImageError] = useState(false)
  const [image, setImage] = useState([])
  const [photos, setPhotos] = useState([])

  // variaveis para gerenciar abetura de modais
  const [openFileRequiredError, setOpenFileRequiredError] = useState(false);
  const [openUpload, setOpenUpload] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openErroPhotoSize, setErroSize] = useState(false)
  const [openErroFileType, setOpenErroFileType] = useState(false);

  // funcoes para gerenciar abetura de modais

  const handleModal = () => {
    setImage([])
    setOpenUpload(openUpload ? false : true)
  }

  const handleFileRequiredError = () => {
    setOpenFileRequiredError(openFileRequiredError ? false : true)
  };

  const handleDelete = () => {
    setOpenDelete(openDelete ? false : true)
  }

  // funcoes de requisicao
  const uploadPhoto = () => {
    if (JSON.stringify(image) === JSON.stringify([])) {
      handleFileRequiredError();
      return
    } else {
      const form = new FormData();
      for (const key in image) {

        form.append('photos', image[key].fileReal);

      }
      setProgress(25)

      instance.post('photos/multiples', form, {
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted)
        },
        headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + localStorage.getItem("token") }
      }).then((response) => {

        if (response.status === 200) {
          handleModal();
          setImage([]);
          setOffSetPhotos(0)
          getPhotos()
        }
      }).catch((error) => {
        if (error.response) {
          console.error('Error response:', error.response);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error:', error.message);
        }
        console.error('Error config:', error.config);
      }).finally(() => {
        setTimeout(() => {
          setProgress(0)
        }, 700);
      });

    }

  };

  const deleteImage = (path, photoId) => {

    instance.delete("/photos?path=" + path + "&photoId=" + photoId, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }
    ).then((response) => {
      console.log(response)
      if (response.status === 200) {
        setPhotos(photos.filter(elem => {
          return elem.path !== path
        }))
        setOpenDelete(false)
      }

    })
  }

  const getPhotos = () => {
    setIsFetchingPhotos(true);
    instance.get("/photos/user/?limit=10&offset=" + offSetPhotos, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      for (const key in response.data.photos) {
        response.data.photos[key].size = utilities.bytesToMegabytes(response.data.photos[key].size)
      }

      setPhotos(photos.concat(response.data.photos));

      if (offSetPhotos + 1 >= response.data.totalPages || response.data.photos.length === 0) return
      setOffSetPhotos(offSetPhotos + 1);
      setIsFetchingPhotos(false);
    }).catch((error) => {
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('avatar')
      }
    })
  }
  // Quando o scrool de photos se move
  const handleScrollPhotos = (event) => {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100 && !isFetchingPhotos) {
      getPhotos()
    }
  }
  useEffect(() => {
    getPhotos()
  }, [])

  return (
    <div className="Container">
      <Menu />
      <div className='PostFotos'>
        <div className='BtnAdd'><button onClick={handleModal} className='ButtonPhoto'>Nova Foto</button></div>

        <div className='ListViews' onScroll={handleScrollPhotos} >
          {photos.length > 0 ? photos.map((photo, index) => (
            <div key={index} className='DashPhoto'>
              <img src={config.baseURL + "/files/photos/" + photo.path} alt="img" className="Image" />
              <div className='CellPhoto'>
                <div className='DataPhoto'>
                  <h5 style={{ color: 'white', fontSize: '17px', }}>data: {utilities.returnDate(photo.createdAt)}</h5>
                </div>
                <div className='DataPhoto'>
                  <h5 style={{ color: 'white', fontSize: '17px', }}>tamanho: {photo.size} mb</h5>
                </div>
                <button className='ButtonDelete' onClick={() => {
                  setSelectedExclude({
                    photoId: photo.id,
                    path: photo.path
                  })
                  handleDelete()
                }}>deletar</button>
              </div>
            </div>
          )) : <div className='BlankData'><img style={{ maxWidth: 500 }} alt="nada" src={Blank} /> <h4 style={{ color: 'white', marginTop: 10 }}>Ops... sem imagens adicionadas, adicione uma nova foto</h4> </div>

          }
        </div>
      </div>

      <div style={{ display: progress > 0 ? 'flex' : 'none', zIndex: 100000000 }} className='TelaDeProgresso'>
        <ProgressBar className='BarraProgresso' now={progress} label={`${progress}%`} />
      </div>

      {/* Toasts */}
      <ToastError show={openErroPhotoSize} setShow={setErroSize} text="Imagem acima de 10 megabytes." />
      <ToastError show={openErroFileType} setShow={setOpenErroFileType} text="O arquivo não é suportado." />
      <ToastError show={openFileRequiredError} setShow={setOpenFileRequiredError} text="A seleção do arquivo é obrigatória." />
      {/* Modais */}
      <Modal show={openDelete} onHide={handleDelete} >
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{
            color: 'white', fontSize: '25px', width: '510px', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente essa foto?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <button className='ButtonModal' onClick={() => { deleteImage(selectedExclude.path, selectedExclude.photoId) }}>Sim</button>
            <button className='ButtonModal' onClick={handleDelete}>Não</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal id='ModalGerenciamentoFotos' show={openUpload} onHide={handleModal} >
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{ color: 'white', width: '100%', fontWeight: 500, textAlign: 'left' }}>Upload de Imagem</h1>
          <div style={image.length > 0 ? { display: 'flex', flexDirection: 'row', overflow: 'auto' } : {}}>
            {
              image.length <= 0 ? <><img alt="search" src={Search} /> <h1 style={{ color: 'white', fontSize: '18px', width: '100%', marginBottom: '5px', fontWeight: 400, textAlign: 'center' }}>Procure por uma imagem</h1></> : image.map((element, index) => { return (<img alt={index} key={index} src={element.file} style={{ width: 'auto', height: 350, margin: 'auto 15px' }} accept='image/*' />) })
            }
          </div>

          <div className='Upload'>
            <button className='ButtonModal' onClick={uploadPhoto}>Enviar</button>
            <label htmlFor='imageInput' className='ButtonInputImage' style={{ color: imageError ? '#FF2E2E' : 'white' }} >Adicionar Imagem</label>
            <input
              multiple={true}
              accept="image/png,image/jpeg,image/jpg"
              id='imageInput'
              className=''
              style={{ display: 'none' }}
              type='file'
              onChange={(event) => {
                var array = []
                const file = event.target.files[0];
                var key = 0
                for (; key < event.target.files.length; key++) {
                  if (event.target.files[key] === undefined) return

                  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
                  if (!acceptedImageTypes.includes(String(event.target.files[key].type))) {
                    setOpenErroFileType(true)
                    return;
                  }
                  if (Validators.checkImageSize()) {
                    array.push({
                      fileReal: event.target.files[key],
                      file: URL.createObjectURL(event.target.files[key])
                    })

                  } else {
                    setErroSize(true)
                    return
                  }

                }
                setImage(array)
              }}
            />
            <button onClick={handleModal} className='ButtonModal'>Fechar</button>
          </div>
        </Modal.Body>
      </Modal>
      <ModalYesNo setShow={setOpenDelete} image={Trash} confirmFunction={() => { deleteImage(selectedExclude.path, selectedExclude.photoId) }} show={openDelete} onHide={handleDelete} title="Deletar Imagem" subtitle="Deseja mesmo excluir permanentemente essa foto?" />

    </div>
  );
}

export default GerenciarFotos;