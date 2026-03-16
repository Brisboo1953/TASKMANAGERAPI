const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const SECRET_KEY = "your_secret_key";

const users = [
  {
    id: 1,
    username: "admin",
    password: "1234"
  },
  {
    id: 2,
    username: "brisseida",
    password: "abcd"
  },
  {
    id: 3,
    username: "test",
    password: "test123"
  }
];

/*token*/
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const loginValidation = [
  body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

/*login*/
const login = (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = generateToken(user);

  res.json({ token });

};

/* VERIFICAR TOKEN */
const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {

    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = user;

    next();

  });

};

module.exports = {
  loginValidation,
  login,
  authenticateToken
};
