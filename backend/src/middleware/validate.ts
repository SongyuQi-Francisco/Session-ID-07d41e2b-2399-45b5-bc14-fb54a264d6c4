import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import type { ApiResponse } from '@/types';

export const validateRequest = (
  dtoClass: new () => any,
  options: {
    skipMissingProperties?: boolean;
    whitelist?: boolean;
    forbidNonWhitelisted?: boolean;
  } = {}
) => {
  const {
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
  } = options;

  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      const dto = Object.assign(new dtoClass(), req.body);
      const errors = await validate(dto, {
        skipMissingProperties,
        whitelist,
        forbidNonWhitelisted,
        validationError: {
          target: false,
          value: true,
        },
      });

      if (errors.length > 0) {
        const errorMessages = formatValidationErrors(errors);
        res.status(400).json({
          success: false,
          error: '请求参数验证失败',
          data: errorMessages,
        });
        return;
      }

      req.body = dto;
      next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        success: false,
        error: '验证失败',
      });
    }
  };
};

export const validateQuery = (
  schema: any,
  options: {
    stripUnknown?: boolean;
  } = {}
) => {
  const { stripUnknown = true } = options;

  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const result = schema.validate(req.query, {
        stripUnknown,
        abortEarly: false,
      });

      if (result.error) {
        const errorMessages = formatJoiErrors(result.error.details);
        res.status(400).json({
          success: false,
          error: '查询参数验证失败',
          data: errorMessages,
        });
        return;
      }

      req.query = result.value;
      next();
    } catch (error) {
      console.error('Query validation error:', error);
      res.status(500).json({
        success: false,
        error: '查询验证失败',
      });
    }
  };
};

export const validateParams = (
  schema: any,
  options: {
    stripUnknown?: boolean;
  } = {}
) => {
  const { stripUnknown = true } = options;

  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const result = schema.validate(req.params, {
        stripUnknown,
        abortEarly: false,
      });

      if (result.error) {
        const errorMessages = formatJoiErrors(result.error.details);
        res.status(400).json({
          success: false,
          error: '路径参数验证失败',
          data: errorMessages,
        });
        return;
      }

      req.params = result.value;
      next();
    } catch (error) {
      console.error('Params validation error:', error);
      res.status(500).json({
        success: false,
        error: '路径参数验证失败',
      });
    }
  };
};

function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const errorMap: Record<string, string[]> = {};

  errors.forEach((error) => {
    const property = error.property;
    const constraints = Object.values(error.constraints || {});

    if (!errorMap[property]) {
      errorMap[property] = [];
    }

    errorMap[property] = [...errorMap[property], ...constraints];
  });

  return errorMap;
}

function formatJoiErrors(errors: any[]): Record<string, string[]> {
  const errorMap: Record<string, string[]> = {};

  errors.forEach((error) => {
    const property = error.path.join('.');
    const message = error.message.replace(/"/g, '');

    if (!errorMap[property]) {
      errorMap[property] = [];
    }

    errorMap[property].push(message);
  });

  return errorMap;
}