
class ClientError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.name = 'ClientError';
      this.statusCode = statusCode;
    }
  }
  
  class ValidationError extends ClientError {
    constructor(message = 'Permintaan tidak valid') {
      super(message, 400);
      this.name = 'ValidationError';
    }
  }
  
  class NotFoundError extends ClientError {
    constructor(message = 'Data tidak ditemukan') {
      super(message, 404);
      this.name = 'NotFoundError';
    }
  }
  
  class ConflictError extends ClientError {
    constructor(message = 'Data sudah ada') {
      super(message, 409);
      this.name = 'ConflictError';
    }
  }
  
  module.exports = { ClientError, ValidationError, NotFoundError, ConflictError };
  