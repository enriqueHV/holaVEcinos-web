import { z } from 'zod';

export const ROLE_OPTIONS = [
  { value: 'junta', label: 'Junta de condominio' },
  { value: 'administradora', label: 'Administradora de inmuebles' },
  { value: 'propietario', label: 'Propietario' },
  { value: 'otro', label: 'Otro' },
] as const;

export const UNIT_RANGE_OPTIONS = [
  { value: '1-20', label: '1 a 20 unidades' },
  { value: '21-50', label: '21 a 50 unidades' },
  { value: '51-100', label: '51 a 100 unidades' },
  { value: '101-250', label: '101 a 250 unidades' },
  { value: '250+', label: 'Más de 250 unidades' },
] as const;

const ROLE_VALUES = ROLE_OPTIONS.map((option) => option.value) as [string, ...string[]];
const UNIT_RANGE_VALUES = UNIT_RANGE_OPTIONS.map((option) => option.value) as [string, ...string[]];

const vePhonePattern = /^(?:\+58|0)?4\d{2}[-\s]?\d{7}$/;

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30, 'El teléfono no puede exceder 30 caracteres.')
  .optional()
  .transform((value) => value ?? '')
  .refine((value) => value.length === 0 || vePhonePattern.test(value), {
    message: 'Ingresa un teléfono válido de Venezuela. Ejemplo: 0412-1234567.',
  });

export const contactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Escribe tu nombre completo.')
    .max(90, 'El nombre no puede exceder 90 caracteres.'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido.')
    .max(120, 'El correo no puede exceder 120 caracteres.'),
  phone: optionalPhoneSchema,
  organizationName: z
    .string()
    .trim()
    .min(2, 'Indica el nombre del condominio u organización.')
    .max(120, 'El nombre no puede exceder 120 caracteres.'),
  role: z.enum(ROLE_VALUES, {
    errorMap: () => ({ message: 'Selecciona el rol que mejor te representa.' }),
  }),
  unitRange: z.enum(UNIT_RANGE_VALUES, {
    errorMap: () => ({ message: 'Selecciona el rango de unidades.' }),
  }),
  message: z
    .string()
    .trim()
    .min(20, 'Cuéntanos un poco más para poder ayudarte.')
    .max(1500, 'El mensaje no puede exceder 1500 caracteres.'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Debes autorizar el tratamiento de datos para continuar.' }),
  }),
  website: z.string().trim().max(200).optional().default(''),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type ContactSubmissionField = keyof ContactSubmission;

export const roleLabelByValue: Record<ContactSubmission['role'], string> = ROLE_OPTIONS.reduce(
  (accumulator, option) => {
    accumulator[option.value] = option.label;
    return accumulator;
  },
  {} as Record<ContactSubmission['role'], string>,
);

export const unitRangeLabelByValue: Record<ContactSubmission['unitRange'], string> =
  UNIT_RANGE_OPTIONS.reduce(
    (accumulator, option) => {
      accumulator[option.value] = option.label;
      return accumulator;
    },
    {} as Record<ContactSubmission['unitRange'], string>,
  );
