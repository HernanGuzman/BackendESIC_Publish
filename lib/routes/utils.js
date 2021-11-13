import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

export const withErrorHandling = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function errorAwareRouter() {
  const basicRouter = express.Router();
  function newRouter(...params) {
    basicRouter(...params);
  }
  newRouter.get = function (path, controller, middleware) {
    if (middleware) {
      basicRouter.get(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.get(path, withErrorHandling(controller));
    }
  };

  newRouter.post = function (path, controller, middleware) {
    if (middleware) {
      basicRouter.post(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.post(path, withErrorHandling(controller));
    }
  };

  newRouter.patch = function (path, controller, middleware) {
    if (middleware) {
      basicRouter.patch(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.patch(path, withErrorHandling(controller));
    }
  };

  newRouter.delete = function (path, controller, middleware) {
    if (middleware) {
      basicRouter.delete(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.delete(path, withErrorHandling(controller));
    }
  };

  newRouter.put = function (path, controller, middleware) {
    if (middleware) {
      basicRouter.put(path, middleware, withErrorHandling(controller));
    } else {
      basicRouter.put(path, withErrorHandling(controller));
    }
  };
  /*
  newRouter.get = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.get(path, ...middlewares, withErrorHandling(controller));
  };
  
  newRouter.post = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.post(path, ...middlewares, withErrorHandling(controller));
  };
  
  newRouter.patch = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.patch(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.delete = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.delete(path, ...middlewares, withErrorHandling(controller));
  };
  newRouter.put = function (path, ...handlers) {
    const controller = last(handlers);
    const middlewares = init(handlers);
    basicRouter.put(path, ...middlewares, withErrorHandling(controller));
  };
  */
  return newRouter;
}

const parseAuthHeader = (header) => {
  const matches = header?.match(/Bearer (.+)/);
  return matches?.[1]; // Si la regexp funcionó, el token es el segundo elemento del array
};

export async function verificarAutenticacion(req, res, next) {
  const accessToken = parseAuthHeader(req.headers.authorization);

  if (!accessToken) {
    return res.status(401).send();
  }

  try {
    const payload = await jwt.verify(accessToken, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (e) {
    // TODO: manejar adecuadamente según el tipo de error. Ver https://www.npmjs.com/package/jsonwebtoken#errors--codes
    return res
      .status(401)
      .json({ mensaje: 'Token invalido. Por favor vuelva a loguearse' });
  }
}
