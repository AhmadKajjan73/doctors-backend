const jwt = require("jsonwebtoken");

const apiResponse = require("../helpers/apiResponse");

const requireAdminAuth = (req, res, next) => {
  const token = req.cookies.id_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        apiResponse.ErrorResponse(res, err.message);
      } else {
        if (decodedToken.usertype === 0) {
          next();
        } else {
          apiResponse.unauthorizedResponse(res, "you can't peform this task");
        }
      }
    });
  } else {
    apiResponse.unauthorizedResponse(res, "you can't peform this task");
  }
};

const requireUserAuth = (req, res, next) => {
  const token = req.cookies.id_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        apiResponse.ErrorResponse(res, err.message);
      } else {
        if (decodedToken.usertype === 1) {
          next();
        } else {
          apiResponse.unauthorizedResponse(res, "you can't peform this task");
        }
      }
    });
  } else {
    apiResponse.unauthorizedResponse(res, "you can't peform this task");
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.id_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        apiResponse.ErrorResponse(res, err.message);
      } else {
        next();
      }
    });
  } else {
    apiResponse.unauthorizedResponse(res, "you can't peform this task");
  }
};

const checkUser = (req, res) => {
  const token = req.cookies.id_token;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return apiResponse.successResponseWithData(res, err.message, null);
      } else {
        const user = {
          id: decodedToken.id,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
          phoneNumber: decodedToken.phoneNumber,
          age: decodedToken.age,
          usertype: decodedToken.usertype,
          profilePhoto: decodedToken.profilePhoto,
          createdAt: decodedToken.createdAt,
          updatedAt: decodedToken.updatedAt,
        };
        return apiResponse.successResponseWithData(res, "loged in", user);
      }
    });
  } else {
    return apiResponse.successResponseWithData(
      res,
      "something went wrong",
      null
    );
  }
};

module.exports = { requireAdminAuth, requireAuth, requireUserAuth, checkUser };
