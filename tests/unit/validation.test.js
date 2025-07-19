const { validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation');

// Mock request and response objects
const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Mock express-validator
jest.mock('express-validator');

describe('Validation Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleValidationErrors', () => {
    it('should call next() when no validation errors exist', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      handleValidationErrors(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 error when validation errors exist', () => {
      const mockErrors = [
        {
          type: 'field',
          msg: 'Name is required',
          path: 'name',
          location: 'body'
        },
        {
          type: 'field',
          msg: 'ID is required',
          path: 'id',
          location: 'params'
        }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      handleValidationErrors(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        errors: mockErrors
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle single validation error', () => {
      const mockError = [{
        type: 'field',
        msg: 'Grade name is required',
        path: 'name',
        location: 'body'
      }];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => mockError
      });

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      handleValidationErrors(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        errors: mockError
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should preserve error structure from express-validator', () => {
      const complexErrors = [
        {
          type: 'field',
          value: '',
          msg: 'Name is required',
          path: 'name',
          location: 'body'
        },
        {
          type: 'field',
          value: 'very-long-name-that-exceeds-character-limit',
          msg: 'Name must be between 1 and 50 characters',
          path: 'name',
          location: 'body'
        }
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => complexErrors
      });

      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      handleValidationErrors(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        errors: complexErrors
      });
    });
  });
});
