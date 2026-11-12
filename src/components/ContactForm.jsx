import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import Button from './ui/Button'
import Icon from './ui/Icon'

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
}

/**
 * Countries with national-number length hints. The backend normalises and
 * validates the final E.164 value, so this list is only a UX aid.
 */
const COUNTRIES = [
  { code: 'IN', label: 'India', dial: '91', min: 10, max: 10 },
  { code: 'US', label: 'United States', dial: '1', min: 10, max: 10 },
  { code: 'CA', label: 'Canada', dial: '1', min: 10, max: 10 },
  { code: 'GB', label: 'United Kingdom', dial: '44', min: 10, max: 10 },
  { code: 'AU', label: 'Australia', dial: '61', min: 9, max: 9 },
  { code: 'AE', label: 'UAE', dial: '971', min: 9, max: 9 },
  { code: 'SG', label: 'Singapore', dial: '65', min: 8, max: 8 },
  { code: 'NZ', label: 'New Zealand', dial: '64', min: 8, max: 10 },
  { code: 'DE', label: 'Germany', dial: '49', min: 10, max: 11 },
  { code: 'FR', label: 'France', dial: '33', min: 9, max: 9 },
  { code: 'NL', label: 'Netherlands', dial: '31', min: 9, max: 9 },
  { code: 'IE', label: 'Ireland', dial: '353', min: 9, max: 9 },
  { code: 'IT', label: 'Italy', dial: '39', min: 9, max: 10 },
  { code: 'ES', label: 'Spain', dial: '34', min: 9, max: 9 },
  { code: 'CH', label: 'Switzerland', dial: '41', min: 9, max: 9 },
  { code: 'SE', label: 'Sweden', dial: '46', min: 9, max: 9 },
  { code: 'PK', label: 'Pakistan', dial: '92', min: 10, max: 10 },
  { code: 'BD', label: 'Bangladesh', dial: '880', min: 10, max: 10 },
  { code: 'NP', label: 'Nepal', dial: '977', min: 10, max: 10 },
  { code: 'LK', label: 'Sri Lanka', dial: '94', min: 9, max: 9 },
  { code: 'ZA', label: 'South Africa', dial: '27', min: 9, max: 9 },
  { code: 'BR', label: 'Brazil', dial: '55', min: 10, max: 11 },
  { code: 'JP', label: 'Japan', dial: '81', min: 10, max: 10 },
  { code: 'CN', label: 'China', dial: '86', min: 11, max: 11 },
  { code: 'OTHER', label: 'Other country', dial: '', min: 6, max: 14 },
]

// Mirrors the backend pattern exactly: no consecutive dots, no leading or
// trailing dot in the local part, real looking domain and TLD.
const emailPattern =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/

function digitsOnly(value) {
  return (value || '').replace(/\D/g, '')
}

function countryFor(code) {
  return COUNTRIES.find((country) => country.code === code) || COUNTRIES[0]
}

function validateField(field, values, country) {
  const value = (values[field] || '').trim()

  switch (field) {
    case 'fullName':
      if (!value) return 'Please enter your full name.'
      if (value.length < 2) return 'That name seems a little short.'
      if (value.length > 120) return 'Please keep your name under 120 characters.'
      return ''
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (!emailPattern.test(value)) return 'That email doesn’t look quite right.'
      return ''
    case 'phone': {
      if (!value) return 'Please enter your phone number.'

      if (country.code === 'OTHER') {
        const cleaned = value.replace(/[\s().-]/g, '')
        if (!/^\+[1-9]\d{6,14}$/.test(cleaned)) {
          return 'Include your country code, e.g. +44 7700 900123.'
        }
        return ''
      }

      const digits = digitsOnly(value)
      if (digits.length < country.min || digits.length > country.max) {
        const expected =
          country.min === country.max ? `${country.min}` : `${country.min}–${country.max}`
        return `${country.label} numbers should have ${expected} digits.`
      }
      return ''
    }
    case 'message':
      if (value.length > 1000) return 'Please keep your message under 1000 characters.'
      return ''
    default:
      return ''
  }
}

function validateAll(values, country) {
  return ['fullName', 'email', 'phone', 'message'].reduce((acc, field) => {
    const error = validateField(field, values, country)
    if (error) acc[field] = error
    return acc
  }, {})
}

function buildPhone(country, rawPhone) {
  if (country.code === 'OTHER') {
    return rawPhone.replace(/[\s().-]/g, '')
  }
  return `+${country.dial}${digitsOnly(rawPhone)}`
}

function firstFieldId(field) {
  return `contact-${field === 'fullName' ? 'name' : field}`
}

export default function ContactForm({ onUnlocked, accessStatus, lead }) {
  const [values, setValues] = useState(initialValues)
  const [countryCode, setCountryCode] = useState('IN')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const successRef = useRef(null)

  const country = countryFor(countryCode)
  const isUnlocked = accessStatus === 'unlocked'
  const unlockedFirstName = (lead?.full_name || '').split(' ')[0]

  // Live verification of the two fields that gate the assistant.
  const emailValue = values.email.trim()
  const emailVerified = emailPattern.test(emailValue)
  const phoneVerified = validateField('phone', values, country) === '' && values.phone.trim() !== ''
  const nameVerified = values.fullName.trim().length >= 2
  const canUnlock = nameVerified && emailVerified && phoneVerified

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      const error = validateField(name, { ...values, [name]: value }, country)
      setErrors((current) => {
        const next = { ...current }
        if (error) next[name] = error
        else delete next[name]
        return next
      })
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    if (!value.trim() && !errors[name]) return

    const error = validateField(name, values, country)
    setErrors((current) => {
      const next = { ...current }
      if (error) next[name] = error
      else delete next[name]
      return next
    })
  }

  const handleCountryChange = (event) => {
    const nextCode = event.target.value
    setCountryCode(nextCode)
    const nextCountry = countryFor(nextCode)
    const error = validateField('phone', values, nextCountry)
    setErrors((current) => {
      const next = { ...current }
      if (error) next.phone = error
      else delete next.phone
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateAll(values, country)
    setErrors(nextErrors)

    const firstError = ['fullName', 'email', 'phone', 'message'].find(
      (field) => nextErrors[field],
    )
    if (firstError) {
      document.getElementById(firstFieldId(firstError))?.focus()
      return
    }

    setStatus('sending')
    setSubmitError('')

    try {
      const result = await api.submitLead({
        full_name: values.fullName.trim(),
        email: values.email.trim(),
        phone_number: buildPhone(country, values.phone),
        message: values.message.trim() || undefined,
        website: honeypot,
      })

      setSubmittedName(result.full_name || values.fullName.trim())
      setStatus('success')
      onUnlocked?.(result)
    } catch (error) {
      setSubmitError(
        error.message || 'Could not save your details. Please try again in a moment.',
      )
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setSubmitError('')
    setStatus('idle')
    setSubmittedName('')
    window.setTimeout(() => document.getElementById('contact-name')?.focus(), 50)
  }

  if (status === 'success') {
    const firstName = submittedName.split(' ')[0] || 'there'
    return (
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/[0.08] blur-3xl"
        />
        <div
          ref={successRef}
          role="status"
          tabIndex={-1}
          aria-live="polite"
          className="animate-fade-in relative flex min-h-[420px] flex-col items-center justify-center py-10 text-center focus:outline-none"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <Icon name="circle-check" size={26} strokeWidth={1.4} />
          </span>
          <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-ink">
            You’re in, {firstName}.
          </h3>
          <p className="mt-3 max-w-sm text-pretty text-[13px] leading-relaxed text-muted">
            Your details are saved securely and the AI assistant is unlocking now. Ask it
            anything about Ravjot’s skills, projects, experience, or background.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            AI assistant unlocked
          </div>
          <p className="mt-6 text-[11px] text-faint">
            The chat opens automatically — or use the button in the bottom-right corner.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={reset} className="mt-6">
            Send another enquiry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-medium tracking-[-0.02em] text-ink">
          Start a conversation
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
          {isUnlocked ? (
            <>
              <Icon name="unlock" size={10} className="text-accent" />
              Assistant unlocked
            </>
          ) : (
            <>
              <Icon name="lock" size={10} className="text-accent" />
              Unlocks AI assistant
            </>
          )}
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-faint">
        Share a few details and the AI assistant opens instantly, ready to answer questions
        about Ravjot’s work.
      </p>

      {isUnlocked && unlockedFirstName ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/[0.05] px-3.5 py-3">
          <Icon name="sparkles" size={14} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-[11px] leading-relaxed text-muted">
            Hi {unlockedFirstName} — your assistant is already unlocked. You can still send a
            new enquiry below.
          </p>
        </div>
      ) : null}

      <form className="mt-7" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Full name <span className="text-accent">*</span>
            </label>
            <input
              id="contact-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Rahul Sharma"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={120}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'contact-name-error' : undefined}
              className="field"
            />
            {errors.fullName ? (
              <p id="contact-name-error" className="mt-1.5 text-[11px] text-red-400">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Email address <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={200}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={`field pr-11 ${emailVerified ? 'border-accent/50' : ''}`}
              />
              {emailVerified ? (
                <span
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-accent"
                  aria-hidden="true"
                >
                  <Icon name="circle-check" size={16} strokeWidth={1.5} />
                </span>
              ) : null}
            </div>
            {errors.email ? (
              <p id="contact-email-error" className="mt-1.5 text-[11px] text-red-400">
                {errors.email}
              </p>
            ) : emailVerified ? (
              <p className="mt-1.5 text-[11px] text-accent/80">Email verified.</p>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="contact-phone"
            className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
          >
            Phone number <span className="text-accent">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative w-[9.5rem] shrink-0 sm:w-[11rem]">
              <select
                id="contact-country"
                value={countryCode}
                onChange={handleCountryChange}
                aria-label="Country code"
                className="field appearance-none pr-8 [&>option]:bg-[#0c0e10]"
              >
                {COUNTRIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.dial ? `+${item.dial} · ${item.label}` : item.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint"
              />
            </div>
            <div className="relative min-w-0 flex-1">
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder={country.code === 'OTHER' ? '+44 7700 900123' : '98765 43210'}
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={24}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                className={`field pr-11 ${phoneVerified ? 'border-accent/50' : ''}`}
              />
              {phoneVerified ? (
                <span
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-accent"
                  aria-hidden="true"
                >
                  <Icon name="circle-check" size={16} strokeWidth={1.5} />
                </span>
              ) : null}
            </div>
          </div>
          {errors.phone ? (
            <p id="contact-phone-error" className="mt-1.5 text-[11px] text-red-400">
              {errors.phone}
            </p>
          ) : phoneVerified ? (
            <p className="mt-1.5 text-[11px] text-accent/80">
              Phone verified — the assistant will unlock once you submit.
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label
              htmlFor="contact-message"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Message <span className="text-faint">(optional)</span>
            </label>
            <span className="font-mono text-[9px] text-faint">{values.message.length}/1000</span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            maxLength={1000}
            placeholder="What would you like to discuss? A role, a project, or a quick question…"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className="field resize-none"
          />
          {errors.message ? (
            <p id="contact-message-error" className="mt-1.5 text-[11px] text-red-400">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot: hidden from humans and assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
          <Icon name="shield" size={14} className="mt-0.5 shrink-0 text-accent/80" />
          <p className="text-[11px] leading-relaxed text-faint">
            <span className="text-muted">Privacy notice:</span> your name, email, phone number
            and message are stored securely and used only to respond to your enquiry and run
            this assistant. Your email and phone number are never shared with the AI model and
            are never shown to other visitors. You can ask for your data to be deleted at any
            time.
          </p>
        </div>

        {status === 'error' && submitError ? (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-[12px] leading-relaxed text-red-300"
          >
            <Icon name="shield" size={14} className="mt-0.5 shrink-0" />
            <span>{submitError}</span>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-[10px] text-faint">
            <Icon name="clock" size={13} />
            Usually replies within one business day
          </p>
          <Button
            type="submit"
            disabled={status === 'sending' || !canUnlock}
            title={
              canUnlock
                ? undefined
                : 'Enter your full name, a valid email address and a valid phone number to unlock the assistant'
            }
            className="w-full sm:w-auto"
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#08090a]/25 border-t-[#08090a]"
                  aria-hidden="true"
                />
                Saving &amp; unlocking…
              </>
            ) : (
              <>
                Submit &amp; start chat
                <Icon name="sparkles" size={15} />
              </>
            )}
          </Button>
        </div>

        <p className="mt-3 flex items-center gap-2 text-[10px] text-faint">
          <Icon
            name={canUnlock ? 'unlock' : 'lock'}
            size={12}
            className={canUnlock ? 'text-accent' : undefined}
          />
          {canUnlock
            ? 'Your details are verified — submitting unlocks the AI assistant.'
            : 'The AI assistant unlocks once your email address and phone number are verified.'}
        </p>
      </form>
    </div>
  )
}
