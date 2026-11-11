import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { api } from '../lib/api'

const initialValues = {
  name: '',
  email: '',
  project: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateField(field, value) {
  const trimmed = value.trim()

  switch (field) {
    case 'name':
      if (!trimmed) return 'Please enter your name.'
      if (trimmed.length < 2) return 'That name seems a little short.'
      return ''
    case 'email':
      if (!trimmed) return 'Please enter your email address.'
      if (!emailPattern.test(trimmed)) return 'That email doesn’t look quite right.'
      return ''
    case 'message':
      if (!trimmed) return 'Please tell me a little about your project.'
      if (trimmed.length < 10) return 'A few more details would help — at least 10 characters.'
      return ''
    default:
      return ''
  }
}

function validateAll(values) {
  return ['name', 'email', 'message'].reduce((acc, field) => {
    const error = validateField(field, values[field])
    if (error) acc[field] = error
    return acc
  }, {})
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const successRef = useRef(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      const error = validateField(name, value)
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

    const error = validateField(name, value)
    setErrors((current) => {
      const next = { ...current }
      if (error) next[name] = error
      else delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateAll(values)
    setErrors(nextErrors)

    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus()
      return
    }

    setStatus('sending')
    setSubmitError('')

    try {
      await api.submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        project: values.project || undefined,
        message: values.message.trim(),
      })
      setStatus('success')
    } catch (error) {
      setSubmitError(error.message || 'Could not send your message. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setSubmitError('')
    setStatus('idle')
    window.setTimeout(() => document.getElementById('contact-name')?.focus(), 50)
  }

  if (status === 'success') {
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
          className="animate-fade-in relative flex min-h-[380px] flex-col items-center justify-center py-10 text-center focus:outline-none"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <Icon name="circle-check" size={26} strokeWidth={1.4} />
          </span>
          <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-ink">Message received.</h3>
          <p className="mt-3 max-w-sm text-pretty text-[13px] leading-relaxed text-muted">
            Thanks, {values.name.split(' ')[0] || 'friend'}. I’ll get back to you at{' '}
            <span className="text-ink">{values.email}</span> within one business day.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={reset} className="mt-7">
            Send another message
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
        <h3 className="text-lg font-medium tracking-[-0.02em] text-ink">Project enquiry</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
          <span className="h-1 w-1 rounded-full bg-accent" />
          Replies within 24h
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-faint">
        A few details go a long way. Your message is stored securely and only used to
        respond to your enquiry.
      </p>

      <form className="mt-7" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Name <span className="text-accent">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Cooper"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className="field"
            />
            {errors.name ? (
              <p id="contact-name-error" className="mt-1.5 text-[11px] text-red-400">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className="field"
            />
            {errors.email ? (
              <p id="contact-email-error" className="mt-1.5 text-[11px] text-red-400">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="contact-project"
            className="mb-2 block font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
          >
            What are you building? <span className="text-faint">(optional)</span>
          </label>
          <div className="relative">
            <select
              id="contact-project"
              name="project"
              value={values.project}
              onChange={handleChange}
              className="field appearance-none pr-10 [&>option]:bg-[#0c0e10]"
            >
              <option value="">Select a project type</option>
              <option value="Website">Website or portfolio</option>
              <option value="Web app">Web application</option>
              <option value="Mobile app">Mobile application</option>
              <option value="Design system">Design system</option>
              <option value="Something else">Something else</option>
            </select>
            <Icon
              name="chevron-down"
              size={15}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-faint"
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label
              htmlFor="contact-message"
              className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint"
            >
              Project details <span className="text-accent">*</span>
            </label>
            <span className="font-mono text-[9px] text-faint">{values.message.length}/1000</span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={1000}
            placeholder="Tell me about the project, timeline, and what success looks like…"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
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

        {status === 'error' && submitError ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-[12px] leading-relaxed text-red-300"
          >
            {submitError}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-[10px] text-faint">
            <Icon name="clock" size={13} />
            Usually replies within one business day
          </p>
          <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
            {status === 'sending' ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#08090a]/25 border-t-[#08090a]"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                Send message
                <Icon
                  name="send"
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
