import './GerenciarFotos.css';

import axios from 'axios';
import config from '../../config'
import Trash from '../../assets/imgs/trash.svg'
import Search from '../../assets/imgs/search.svg'
import Menu from '../../components/menu/Menu.js'
import { useState, useEffect } from 'react';
import { checkImageSize } from '../validators'
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
const instance = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  }
});

function bytesToMegabytes(bytes) {
  const megabytes = bytes / (1024 * 1024);
  return megabytes.toFixed(2);
}

function data(date) {
  const dateObject = new Date(date);

  const year = dateObject.getFullYear();
  //const nameMonth = date.toLocaleString('default', { month: 'long' });
  const month = dateObject.getMonth();
  const day = dateObject.getDate();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
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
  return `${day} de ${meses[month]} de ${year} às ${hours}:${minutes}`
}

function GerenciarFotos() {
  // variaives extras
  const [selectedExclude, setSelectedExclude] = useState({})
  const [imageError, setImageError] = useState(false)
  const [image, setImage] = useState({ file: null, })
  const [photos, setPhotos] = useState([])

  // variaveis para gerenciar abetura de modais
  const [openFileRequiredError, setOpenFileRequiredError] = useState(false);
  const [openUpload, setOpenUpload] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openErroPhotoSize, setErroSize] = useState(false)
  const [openErroFileType, setOpenErroFileType] = useState(false);

  // funcoes para gerenciar abetura de modais

  const handleModal = () => {
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
    if (!image.fileReal) {
      handleFileRequiredError();
      return;
    }
    const form = new FormData();
    form.append('photo', image.fileReal);

    axios.post(config.baseURL + '/photos/', form, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Bearer ' + localStorage.getItem("token") }
    }).then((response) => {

      if (response.status === 200) {
        handleModal();
        uploadPhotos()
        setImage({});
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
    });
  };

  const delet = (path, photoId) => {

    axios.delete(config.baseURL + "/photos?path=" + path + "&photoId=" + photoId, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }
    ).then((response) => {

      if (response.status === 200) {
        handleDelete()
        uploadPhotos()
      }

    })
  }
  const uploadPhotos = () => {
    instance.get('/photos/user/').then((response) => {
      for (const key in response.data) {

        response.data[key].size = bytesToMegabytes(response.data[key].size)
      }
      setPhotos(response.data)
    }).catch((response) => {
      if (response['response']['data']['message'] === ["No photos found for this user."]) {
        setPhotos([])
      }
    })
  }
  useEffect(() => {
    console.log('render')
    uploadPhotos()
  }, [])

  return (
    <div className="Container">
      <Menu />
      <div className='PostFotos'>
        {photos !== undefined && photos.map((photo, index) => (
          <div key={index} className='DashPhoto'>
            <img src={config.baseURL + "/files/photos/" + photo.path} alt="" className="Image" />
            <div className='CellPhoto'>
              <div className='DataPhoto'>
                <h5 style={{ color: 'white', fontSize: '17px', }}>data: {data(photo.createdAt)}</h5>
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
        ))}

        <div className='BackSidePhoto'>

          <button className="ButtonPhoto" onClick={handleModal}>Adicionar Foto</button>
        </div>
      </div>

      {/* toasts */}
      <ToastContainer
          className="p-3"
          position={'bottom-end'}
          style={{ zIndex: 10000}}>
          <Toast
          onClose={() => setErroSize(false)} show={openErroPhotoSize} delay={3000} autohide
          >
        <Toast.Header style={{background:'#ff6347', color:'white'}} closeButton={false}>
              <strong className="me-auto">Error</strong>
              <small>agora</small>
            </Toast.Header>
            <Toast.Body style={{background: '#ff6347', color:'white'}}>Imagem acima de 10 megabytes.</Toast.Body>
          </Toast>
        </ToastContainer>

      <ToastContainer
          className="p-3"
          position={'bottom-end'}
          style={{ zIndex: 10000}}>
          <Toast
          onClose={() => setOpenErroFileType(false)} show={openErroFileType} delay={3000} autohide
          >
        <Toast.Header style={{background:'#ff6347', color:'white'}} closeButton={false}>
              <strong className="me-auto">Error</strong>
              <small>agora</small>
            </Toast.Header>
            <Toast.Body style={{background: '#ff6347', color:'white'}}>O arquivo não é suportado.</Toast.Body>
          </Toast>
        </ToastContainer>

      <ToastContainer
          className="p-3"
          position={'bottom-end'}
          style={{ zIndex: 10000}}>
          <Toast
          onClose={() => setOpenFileRequiredError(false)} show={openFileRequiredError} delay={3000} autohide
          >
        <Toast.Header style={{background:'#ff6347', color:'white'}} closeButton={false}>
              <strong className="me-auto">Error</strong>
              <small>agora</small>
            </Toast.Header>
            <Toast.Body style={{background: '#ff6347', color:'white'}}>A seleção do arquivo é obrigatória.</Toast.Body>
          </Toast>
        </ToastContainer>

      <Modal show={openDelete} onHide={handleDelete} >
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
          <h1 style={{
            color: 'white', fontSize: '25px', width: '510px', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente essa foto?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <button className='ButtonModal' onClick={() => { delet(selectedExclude.path, selectedExclude.photoId) }}>Sim</button>
            <button className='ButtonModal' onClick={handleDelete}>Não</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openUpload} onHide={handleModal} >
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
        <h1 style={{color: 'white', width: '100%', fontWeight:500, textAlign:'left'}}>Upload de Imagem</h1>
          {
            image.file === null ? <><img src={Search} /> <h1 style={{color: 'white', fontSize: '18px', width: '100%', marginBottom: '5px', fontWeight:400, textAlign:'center'}}>Procure por uma imagem</h1></> : <img alt='' src={image.file} style={{ width: '100%', height: 'auto' }} accept="image/*" />
          }
          <div className='Upload'>
            <button className='ButtonModal' onClick={uploadPhoto}>Enviar</button>
            <label htmlFor='imageInput' className='ButtonInputImage' style={{ color: imageError ? '#FF2E2E' : 'white' }} >Adicionar Imagem</label>
            <input
              accept="image/png,image/jpeg,image/jpg"
              id='imageInput'
              className=''
              style={{ display: 'none' }}
              type='file'
              onChange={(event) => {
                const file = event.target.files[0];
                const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
                if (!acceptedImageTypes.includes(file['type'])) {
                  setOpenErroFileType(true)
                  return;
                }
                if (checkImageSize()) {
                  setImage({
                    fileReal: file,
                    file: URL.createObjectURL(file)
                  })
                  setPhotos(uploadPhotos())
                } else {
                  setErroSize(true)
                }
              }}
            />
            <button onClick={handleModal} className='ButtonModal'>Fechar</button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={openDelete} onHide={handleDelete} >
        <Modal.Body style={{ backgroundColor: 'var(--color3)' }}>
        <h1 style={{color: 'white', width: '100%', fontWeight:500, textAlign:'left'}}>Deletar Imagem</h1>

          <img src={Trash} style={{width:'85%', margin:'0px auto', textAlign:'center'}}/>
          <h1 style={{
            color: 'white', fontSize: '25px', width: '100%', marginBottom: '5px',
          }}>Deseja mesmo excluir permanentemente essa foto?</h1>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <button className='ButtonModal' onClick={() => { delet(selectedExclude.path, selectedExclude.photoId) }}>Sim</button>
            <button className='ButtonModal' onClick={handleDelete}>Não</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default GerenciarFotos;
