require("dotenv").config();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../config/db");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userByEmail = await db.query(
      "SELECT u.* FROM users u WHERE u.email = $1",
      [email],
    );

    if(userByEmail.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const user = userByEmail.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Usuário ou senha incorretos." });
    }

    res.json({ message: "Login realizado com sucesso." });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const register = async (req, res) => {
  const requiredFields = {
    username: "nome",
    email: "email",
    password: "senha",
  };
  const { username, email, password } = req.body;

  try {
    const userExists = await db.query(
      "SELECT u.* FROM users u WHERE u.email = $1",
      [email],
    );

    if (userExists.rows.length > 0) {
      res.status(401).json({ message: "Usuário já cadastrado." });
    } else {
      const validation = verifyFields(
        { username, email, password },
        requiredFields,
      );

      if (validation.length === 0) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await db.query(
          "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
          [username, email, hashedPassword],
        );

        if (newUser.rowCount > 0) {
          res.json({ message: "Usuário cadastrado com sucesso." });
        } else {
          res.status(401).json({ message: "Erro ao cadastrar usuário." });
        }
      } else {
        if (validation.length > 0) {
          res.status(401).json({
            message: `Os campos ${validation.join(",  ")} são obrigatórios`,
          });
        } else {
          res
            .status(401)
            .json({ message: `O campo ${validation[0]} é obrigatório` });
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

function verifyFields(fields, requiredFields) {
  let emptyFields = [];

  for (let field in requiredFields) {
    if (!fields[field]) {
      emptyFields.push(requiredFields[field]);
    }
  }

  return emptyFields;
}

module.exports = {
  login,
  register,
};
