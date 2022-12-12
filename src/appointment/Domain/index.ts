/**
 * Model Appointment
 *
 */
export interface Appointment {
  id: number
  createAt: Date | null
  appointmentDate: Date
  state: Appointment_state
  client_id: string
  employee_id: number
}

const AppointmentState = {
  pending: 'pending',
  confirmed: 'confirmed',
  process: 'process',
  close: 'close',
  cancelled: 'cancelled'
}

export type Appointment_state = (typeof AppointmentState)[keyof typeof AppointmentState]
