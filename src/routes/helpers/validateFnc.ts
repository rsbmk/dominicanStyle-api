import { Response } from "express";
import dayjs from "dayjs";
import { MIN_TIME_FOR_APPOINTMENT } from "../../constants";

export function validateManyFilds(response: Response, objToValidate: any, fields: string[]) {
  let errors = false;
  fields.forEach((field) => {
    if (!objToValidate[field]) {
      response
        .status(400)
        .json({
          error: "Todos los campos son requeridos",
          fields,
          message: "Este campo es requerido",
          nameInput: field,
          status: 400,
        })
        .end();
      errors = true;
    }
  });
  return errors;
}

export function validateNumberFild(response: Response, field: string, value: number) {
  if (isNaN(value) || typeof value !== "number") {
    response
      .status(400)
      .json({
        error: "El campo debe ser un numero",
        fields: [field],
        message: "Este campo debe ser un numero",
        nameInput: field,
        status: 400,
      })
      .end();
    return true;
  }
  return false;
}

export function validateTelephone(response: Response, telephone: string) {
  const validateNumber = /^09[0-9]{8}$/;
  if (!validateNumber.test(telephone)) {
    response
      .status(400)
      .json({
        error: "El número de teléfono no es valido",
        fields: ["telephone"],
        message: "Debe iniciar con 09, y tener 10 digitos",
        nameInput: "telephone",
        status: 400,
      })
      .end();
    return true;
  }
  return false;
}

export function validateIsDate(response: Response, date: Date) {
  if (!dayjs(date).isValid()) {
    response
      .status(400)
      .json({
        error: "La fecha no es valida",
        fields: ["date"],
        message: "Debe ser una fecha valida",
        nameInput: "date",
        status: 400,
      })
      .end();
    return true;
  }
  return false;
}

export function validateArray(response: Response, array: any[], field: string) {
  if (!Array.isArray(array)) {
    response
      .status(400)
      .json({
        error: "El campo debe ser un array",
        fields: [field],
        message: "Este campo debe ser un array",
        nameInput: field,
        status: 400,
      })
      .end();
    return true;
  }

  if (array.length === 0) {
    response
      .status(400)
      .json({
        error: "El campo debe tener al menos un elemento",
        fields: [field],
        message: "Este campo debe tener al menos un elemento",
        nameInput: field,
        status: 400,
      })
      .end();
    return true;
  }

  return false;
}

export const ValidatedTimeAppointment = (response: Response, date: Date) => {
  let message = `No se puede agendar una cita sin el tiempo mínimo de anticipación (${MIN_TIME_FOR_APPOINTMENT} horas antes)`;
  const now = dayjs().add(MIN_TIME_FOR_APPOINTMENT, "hour").toDate().getTime();
  const minTime = dayjs(date).toDate().getTime();

  const isValidDate = now - minTime <= 0;

  if (!isValidDate) {
    response
      .status(400)
      .json({
        message,
        status: 400,
        error: "Fecha invalida",
        fields: ["appointmentDate"],
        nameInput: "appointmentDate",
      })
      .end();
    return true;
  }
  return false;
};

//minimun length for a CI is 10
export const isCIValid = (response: Response, ci: string, field: string) => {
  const validateCi = /^[0-9]{10}$/;
  if (!validateCi.test(ci)) {
    response
      .status(400)
      .json({
        error: "La cedula no es valida",
        fields: [field],
        message: "Debe tener 10 digitos",
        nameInput: field,
        status: 400,
      })
      .end();
    return true;
  }
  return false;
};
