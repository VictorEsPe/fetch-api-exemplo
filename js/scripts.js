const apiUrl = 'https://jsonplaceholder.typicode.com/posts'
const loadingMessage = document.querySelector('#loading')
const postsContainer = document.querySelector('#posts-container')

const postPage = document.querySelector('#post')
const postContainer = document.querySelector('#post-container')
const commentsContainer = document.querySelector('#comments-container')
const commentForm = document.querySelector('#comment-form')
const emailInput = document.querySelector('#email')
const bodyInput = document.querySelector('#body')

// pegar o id da url do post.html
// TODO: pesquisar sobre a funcionalidade URLSearchParams
const urlSearchParams = new URLSearchParams(window.location.search)
const postIdUrl = urlSearchParams.get('id')
/* 
 As duas linhas de código acima permite acessar os parâmetros usados dentro de uma URL 
*/

// pegar todos os posts da API
async function getAllPosts() {
  const response = await fetch(apiUrl)

  /* pega os dados fornecidos da API e os transforma em array de objetos. Essa etapa é necessária para trablhar com dados de API's */
  const data = await response.json()

  loadingMessage.classList.add('hide')

  // percorrer por todos os objetos da array
  data.map(post => {
    // criar elementos html que receberão as partes do objeto
    const parentDiv = document.createElement('div')
    const title = document.createElement('h2')
    const textBody = document.createElement('p')
    const link = document.createElement('a')

    // atribuir os dados do objeto aos elementos
    title.innerText = post.title
    textBody.innerText = post.body
    link.innerText = 'Ler'
    // para direcionar a página individual do post
    link.setAttribute('href', `/post.html?id=${post.id}`)

    parentDiv.appendChild(title)
    parentDiv.appendChild(textBody)
    parentDiv.appendChild(link)

    postsContainer.appendChild(parentDiv)
  })
}

// pegar post individual
async function getPost(id) {
  const [responsePost, responseComment] = await Promise.all([
    fetch(`${apiUrl}/${id}`),
    fetch(`${apiUrl}/${id}/comments`),
  ])

  const dataPost = await responsePost.json()
  const dataComment = await responseComment.json()

  loadingMessage.classList.add('hide')
  postPage.classList.remove('hide')

  const title = document.createElement('h2')
  const textBody = document.createElement('p')

  title.innerText = dataPost.title
  textBody.innerText = dataPost.body

  postContainer.appendChild(title)
  postContainer.appendChild(textBody)

  dataComment.map((comment) => {
    createComment(comment)
  })
}

function createComment(comment) {
  const parentDiv = document.createElement('div')
  const email = document.createElement('h3')
  const commentBody = document.createElement('p')

  email.innerText = comment.email
  commentBody.innerText = comment.body

  parentDiv.appendChild(email)
  parentDiv.appendChild(commentBody)
  commentsContainer.appendChild(parentDiv)
}

async function postComment(comment) {
  // como agora estou postando dados na API, o fetch precisa de algumas configurações
  const response = await fetch(`${apiUrl}/${postIdUrl}/comments`, {
    method:"POST",
    body: comment,
    headers: {
      "Content-type": "application/json"
    }
  })

  const data = await response.json()

  createComment(data)

  console.log(data);
}

// 'if' colocado para evitar que o JS tente carregar todos os posts na 'post.html'
if (!postIdUrl) {
  getAllPosts()
} else {
  getPost(postIdUrl)

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    }

    // transformar o objeto em uma string JSON
    comment = JSON.stringify(comment)

    postComment(comment)
  })
}
