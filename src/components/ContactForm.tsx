import { useEffect, useMemo, useRef, useState } from 'react';
import {
  contactSubmissionSchema,
  ROLE_OPTIONS,
  type ContactSubmissionField,
  UNIT_RANGE_OPTIONS,
} from '../lib/contactSchema';
import styles from './ContactForm.module.css';

type ContactFormState = 'idle' | 'submitting' | 'success' | 'error';

type FieldErrors = Partial<Record<ContactSubmissionField, string>>;

type FormValues = {
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  role: string;
  unitRange: string;
  message: string;
  consent: boolean;
  website: string;
};

type ApiSuccess = {
  ok: true;
  message: string;
  warning?: string;
};

type ApiError = {
  ok: false;
  message: string;
  fieldErrors?: FieldErrors;
};

type ApiResponse = ApiSuccess | ApiError;

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  organizationName: '',
  role: '',
  unitRange: '',
  message: '',
  consent: false,
  website: '',
};

const requiredFieldsInOrder: ContactSubmissionField[] = [
  'name',
  'email',
  'organizationName',
  'role',
  'unitRange',
  'message',
  'consent',
];

function pickFirstErrorField(errors: FieldErrors): ContactSubmissionField | null {
  for (const field of requiredFieldsInOrder) {
    if (errors[field]) return field;
  }
  return null;
}

function endpointUrl(): string {
  const raw = import.meta.env.VITE_CONTACT_ENDPOINT;
  return typeof raw === 'string' && raw.trim().length > 0 ? raw : '/api/contact';
}

function normalizeErrorsFromSchema(values: FormValues): FieldErrors {
  const parsed = contactSubmissionSchema.safeParse(values);
  if (parsed.success) return {};

  const nextErrors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string') continue;
    if (nextErrors[key as ContactSubmissionField]) continue;
    nextErrors[key as ContactSubmissionField] = issue.message;
  }
  return nextErrors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<ContactFormState>('idle');
  const [responseMessage, setResponseMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');
  const successMessageRef = useRef<HTMLDivElement | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const organizationRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLSelectElement | null>(null);
  const unitRangeRef = useRef<HTMLSelectElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);

  const fieldRefs = useMemo(
    () => ({
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      organizationName: organizationRef,
      role: roleRef,
      unitRange: unitRangeRef,
      message: messageRef,
      consent: consentRef,
      website: { current: null },
    }),
    [],
  );

  useEffect(() => {
    if (status === 'success') {
      successMessageRef.current?.focus();
    }
  }, [status]);

  function focusField(field: ContactSubmissionField | null): void {
    if (!field) return;
    const target = fieldRefs[field].current;
    target?.focus();
  }

  function updateValue<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field as ContactSubmissionField]) return previous;
      const next = { ...previous };
      delete next[field as ContactSubmissionField];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralErrorMessage('');
    setWarningMessage('');

    const localErrors = normalizeErrorsFromSchema(values);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setStatus('error');
      focusField(pickFirstErrorField(localErrors));
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const response = await fetch(endpointUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as ApiResponse;

      if (!response.ok || !payload.ok) {
        const fieldErrors = payload.ok ? {} : payload.fieldErrors ?? {};
        setErrors(fieldErrors);
        setStatus('error');
        setGeneralErrorMessage(payload.message || 'No pudimos enviar el formulario en este momento.');
        focusField(pickFirstErrorField(fieldErrors));
        return;
      }

      setStatus('success');
      setResponseMessage(payload.message);
      setWarningMessage(payload.warning ?? '');
    } catch {
      setStatus('error');
      setGeneralErrorMessage(
        'Ocurrió un problema de conexión. Intenta nuevamente o escríbenos a esucre@holavecinos.app.',
      );
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successMessageRef}
        tabIndex={-1}
        className={styles.successPanel}
        aria-live="polite"
        aria-atomic="true"
      >
        <h3>Gracias por escribirnos</h3>
        <p>{responseMessage}</p>
        {warningMessage && <p className={styles.warningText}>{warningMessage}</p>}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className={styles.form} aria-describedby="form-feedback">
      <p id="form-feedback" className={styles.formSupport}>
        Te respondemos por correo con los próximos pasos.
      </p>

      {generalErrorMessage && (
        <p className={styles.generalError} role="alert">
          {generalErrorMessage}
        </p>
      )}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="name">Nombre y apellido*</label>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className={styles.errorText}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Correo electrónico*</label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateValue('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className={styles.errorText}>
              {errors.email}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Teléfono</label>
          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Ej: 0412-1234567"
            value={values.phone}
            onChange={(event) => updateValue('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
          />
          <p id="phone-hint" className={styles.hint}>
            Opcional. Formato sugerido para Venezuela.
          </p>
          {errors.phone && (
            <p id="phone-error" className={styles.errorText}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="organizationName">Condominio u organización*</label>
          <input
            ref={organizationRef}
            id="organizationName"
            name="organizationName"
            type="text"
            value={values.organizationName}
            onChange={(event) => updateValue('organizationName', event.target.value)}
            aria-invalid={Boolean(errors.organizationName)}
            aria-describedby={errors.organizationName ? 'organization-error' : undefined}
          />
          {errors.organizationName && (
            <p id="organization-error" className={styles.errorText}>
              {errors.organizationName}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="role">Tu rol*</label>
          <select
            ref={roleRef}
            id="role"
            name="role"
            value={values.role}
            onChange={(event) => updateValue('role', event.target.value)}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'role-error' : undefined}
          >
            <option value="">Selecciona una opción</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p id="role-error" className={styles.errorText}>
              {errors.role}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="unitRange">Número de unidades*</label>
          <select
            ref={unitRangeRef}
            id="unitRange"
            name="unitRange"
            value={values.unitRange}
            onChange={(event) => updateValue('unitRange', event.target.value)}
            aria-invalid={Boolean(errors.unitRange)}
            aria-describedby={errors.unitRange ? 'unitRange-error' : undefined}
          >
            <option value="">Selecciona un rango</option>
            {UNIT_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.unitRange && (
            <p id="unitRange-error" className={styles.errorText}>
              {errors.unitRange}
            </p>
          )}
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="message">Mensaje*</label>
          <textarea
            ref={messageRef}
            id="message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => updateValue('message', event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className={styles.errorText}>
              {errors.message}
            </p>
          )}
        </div>

        <div className={styles.honeypotField} aria-hidden="true">
          <label htmlFor="website">Sitio web</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => updateValue('website', event.target.value)}
          />
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label className={styles.checkboxLabel}>
            <input
              ref={consentRef}
              id="consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(event) => updateValue('consent', event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
            />
            <span>
              Autorizo el tratamiento de mis datos para que holaVEcinos me contacte sobre esta solicitud.*
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className={styles.errorText}>
              {errors.consent}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Enviando...
          </>
        ) : (
          'Enviar solicitud'
        )}
      </button>
    </form>
  );
}
