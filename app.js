require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config to express JSON

app.use(express.json())

//Users
const User = require('./models/User')

//Public

app.get('/', (req, res) => {
    res.status(200).json({msg: 'Testando mensagem'})
})

//Private
app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    //check user
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({user})
})

//Register user
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmpassword} = req.body

    if(!name){
        return res.status(422).json({msg: 'Preencha o campo nome!'})
    }

    if(!email){
        return res.status(422).json({msg: 'Preencha o campo email!!'})
    }

    if(!password){
        return res.status(422).json({msg: 'Preencha o campo senha'})
    }

    if(!confirmpassword){
        return res.status(422).json({msg: 'Preencha o campo de confirmação da senha!'})
    }

    if(password != confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})

    }
    //check user
    const userExists = await User.findOne({email: email})

    //check email
    if(userExists){
        return res.status(422).json({msg: "Email já cadastrado, por favor utilize outro email!"})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try{
        await user.save()

        return res.status(200).json({msg: "Usuário registrado com sucesso!"})
    }
    catch(e){
        console.log(e)

        return res.status(500).json({msg: 'Erro no servidor, tente novamente mais tarde!'})
    }

})

//Login
app.post("/auth/login", async (req, res) => {

    const {email, password} = req.body

    //validation

    if(!email){
        return res.status(422).json({msg: 'Preencha o campo email!'})
    }

    if(!password){
        return res.status(422).json({msg: 'Preencha o campo senha!'})
    }

    //check user

    const user = await User.findOne({email: email})

    if(!user){
        return res.status(422).json({msg: "Usuário não encontrado!"})
    }

    //check password

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha inválida!"})
    }

    try{
        
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id,
        },secret,)

        return res.status(200).json({msg: 'Autenticação realizada com sucesso', token})
    }
    catch(e){
        console.log(e)

        return res.status(500).json({msg: 'Erro no servidor, tente novamente mais tarde!'})
    }
})

//Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.whxr4yj.mongodb.net/?retryWrites=true&w=majority`,
    )
    .then(() => {
    app.listen(3000)
    console.log("Conectado no banco")
}).catch((erro) => console.log(erro))

//Functions

function checkToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    }
    catch(e){
        return res.status(400).json({msg: 'Token inválido'})
    }

}

