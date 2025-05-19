import express from 'express';
import { emailVerification, getAllUsers, logIn, UserRegister } from '../controllers/UserController.js';
const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.post('/login', logIn);
userRouter.post('/register', UserRegister);
userRouter.post('/verify', emailVerification)

userRouter.post('/logout', (req, res) => {
    console.log('Hello from the user logout route');
}
);

export default userRouter;