import './PesquisarUsers.css';

import { useEffect, useState } from 'react'
import Menu from '../../components/menu/Menu.js'
import config from '../../config';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Lupa from '../../assets/imgs/lupa.svg'

function PesquisarUsers() {
  // Controladores da requisição
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const [searchUser, setSearchUser] = useState(false);

  const [offSetUsers, setOffSetUsers] = useState(0);

  const [users, setUsers] = useState([])


  const navigate = useNavigate()

  function getUsers() {
    setIsFetchingUsers(true);
    axios.get(config.baseURL + "/users?limit=10&offset=", {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then((response) => {
      setUsers(users.concat(response.data.users));

      if (offSetUsers + 1 >= response.data.totalPages || response.data.users.length === 0) return

      setOffSetUsers(offSetUsers + 1); // Usando a função de atualização do estado para obter o valor mais recente de 'page'
      setIsFetchingUsers(false);
    })
  }




  // Quando o scroll de posts se move
  const handleScrollUsers = (event) => {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100 && !isFetchingUsers) {
      getUsers()
    }
  }



  useEffect(() => {
    getUsers()
  }, [])

  const returnBackground = (url) => {
    var part1 = "url("
    var part2 = url === "" ? "" : config.baseURL + '/files/avatar/' + url
    var part3 = ")  center/cover"
    return part1 + part2 + part3
  }

  return (

    <>
      <div className="Container">
        <Menu />
        <div className='PostDashBoard'>

          {users.length > 0 && users.map((user, index) => (
            <div key={index} onClick={() => { navigate('/profile/' + user.id) }} className='UserItem'>
              <div style={{ background: returnBackground(user.avatar) }} className='AvatarUser'></div>
              <h3>@{user.username}</h3>
            </div>
          ))}

        </div>
      </div>

    </>

  );
}

export default PesquisarUsers;
