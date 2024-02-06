/* import { uManager } from "../dao/managersMongo/usersManager.js"; */
import { hashData, compareData } from "../utils.js";
import {Router} from "express"
import passport from "passport"
import "../passport.js"
import { generateToken } from "../utils.js"
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";


const router = Router();


router.post('/signup', passport.authenticate('signup'), (req, res) => {
  
    res.json({message: 'Signed up'})    
})





router.get('/current', passport.authenticate('jwt', {session: false}), async(req, res) => {
  const userDTO = new UsersResponseDto(req.user);
  res.status(200).json({message: 'User logged', user: userDTO})  
})


router.get('/signout', async(req, res)=>{
  req.session.destroy(()=> {       
      res.redirect('/login')
  })
})


//ESTO ES LO QUE HIZO EL PROFE EN CLASE QUE AL FINAL LO REFORMULÉ
router.post('/login', passport.authenticate('login', {failureMessage: true, failureRedirect: "/login"}),(req, res) => {
  //  res.json({message: 'Signed up'})
    //le paso el req.user por parámetro a generateToken para guardar en el token la info del usuario
    
    const {name, email, age, role, carts} = req.user    
   
    const token = generateToken({ name, email, age, role, carts})
    //ahora guardo en cookies el token, 'token' va a ser el nombre de la cookie
    //maxAge es la duracion de la cookie y httpOnly para que  no se pueda
    //recuperar esa cookie desde el front, solo va a ser accedido desde un request http
    res.cookie('token', token, { maxAge: 60000, httpOnly: true })
    return res.redirect('/api/sessions/current')
}) 



export default router



