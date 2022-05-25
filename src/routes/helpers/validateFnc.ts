import { Response } from "express";

export function validateManyFilds(response: Response, objToValidate: any, fields: string[]) {
  fields.forEach((field) => {
    if (!objToValidate[field]) {
      return response
        .status(400)
        .json({
          error: "Todos los campos son requeridos",
          fields,
          message: "Este campo es requerido",
          nameInput: field,
          status: 400,
        })
        .end();
    }
  });
}

export function validateNumberFild(response: Response, field: string, value: number) {
  if (!value || isNaN(value))
    return response
      .status(400)
      .json({
        error: "El campo es requerido",
        status: 400,
        message: "Este campo es requerido",
        nameInput: field,
      })
      .end();
}

export function validateTelephone(response: Response, telephone: string) {
  const validateNumber = /^09[0-9]{8}$/;
  if (!validateNumber.test(telephone))
    return response
      .status(400)
      .json({
        error: "El número de teléfono no es valido",
        fields: ["telephone"],
        message: "Debe iniciar con 09, y tener 10 digitos",
        nameInput: "telephone",
        status: 400,
      })
      .end();
}
