import {
  data,
  useFetcher,
  useLoaderData,
  type ClientActionFunctionArgs,
} from 'react-router'
import type { HTMLInputTypeAttribute } from 'react'
import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { z } from 'zod'
import { parseWithZod, getZodConstraint } from '@conform-to/zod/v4'
import { supabase, supabaseAdmin } from '~/lib/supabase/client'
import Icon from '~/components/icon'

function Field({
  autofocus,
  field,
  name,
  placeholder,
  type,
}: {
  autofocus?: boolean
  field: any
  name: string
  placeholder: string
  type: HTMLInputTypeAttribute
}) {
  return (
    <label className='floating-label' htmlFor={field.id}>
      <span>{name}</span>
      <input
        autoFocus={autofocus}
        className={`input input-bordered input-lg w-full ${field.errors ? 'input-error' : ''}`}
        placeholder={placeholder}
        {...getInputProps(field, { type: type || 'text' })}
      />
      <p className='h-4 ml-2 mt-2 text-error text-xs/4' id={field.errorId}>
        {field.errors}
      </p>
    </label>
  )
}

interface Teacher {
  email: string
  first_name: string
  last_name: string
  user_id: string
  user_role: string
}

const CreateTeacherSchema = z.object({
  email: z.email({ error: 'Email is required' }).trim().toLowerCase(),

  password: z
    .string({ error: 'Password is required' })
    .trim()
    .min(6, 'Password must be at least 6 characters'),

  first_name: z
    .string({ error: 'First name is required' })
    .trim()
    .min(1, 'First name is too short')
    .transform((v) => v.charAt(0).toUpperCase() + v.slice(1)),

  last_name: z
    .string({ error: 'Last name is required' })
    .trim()
    .min(1, 'Last name is too short')
    .transform((v) => v.charAt(0).toUpperCase() + v.slice(1)),
})

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: CreateTeacherSchema })

  if (submission.status !== 'success') {
    return data({ result: submission.reply() })
  }

  const { email, password, first_name, last_name } = submission.value

  // Create the user account
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name,
      last_name,
      user_role: 'teacher',
    },
  })

  if (error) {
    return data({
      result: submission.reply({
        formErrors: [error.message],
      }),
    })
  }

  return data({
    result: submission.reply({ resetForm: true }),
  })
}

export async function clientLoader(): Promise<{
  teachers: Teacher[]
  error?: string
}> {
  const { data: teachers, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_role', 'teacher')

  if (error) {
    return { teachers: [], error: error.message ?? String(error) }
  }

  return { teachers: (teachers || []) as Teacher[] }
}

export default function AdminTeachersPage() {
  const { teachers } = useLoaderData<typeof clientLoader>()

  const createTeacher = useFetcher<typeof clientAction>()
  const loading = createTeacher.state !== 'idle'

  const [form, fields] = useForm({
    constraint: getZodConstraint(CreateTeacherSchema),
    id: 'create-teacher-form',
    lastResult: createTeacher.data?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateTeacherSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  })

  return (
    <div>
      <h1 className='font-bold mb-8 text-4xl'>Manage Teachers</h1>
      <div className='join join-vertical bg-base-100 w-full'>
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div
              className='collapse collapse-arrow join-item border-base-300 border'
              key={teacher.user_id}
            >
              <input type='radio' name='teacher-list' />
              <div className='collapse-title font-semibold'>
                {teacher.first_name} {teacher.last_name}
              </div>
              <div className='collapse-content'>
                <p>ID: {teacher.user_id}</p>
                <p>User Role: {teacher.user_role}</p>
                <p>Email: {teacher.email}</p>
              </div>
            </div>
          ))
        ) : (
          <div className='alert alert-info alert-outline'>
            <span>No teachers have been created</span>
          </div>
        )}
      </div>
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Add New Teacher</h2>
        <createTeacher.Form
          method='post'
          className='space-y-4 max-w-md'
          {...getFormProps(form)}
        >
          {form.errors && (
            <div className='alert alert-error' id={form.errorId}>
              <Icon name='bug' size='lg' />
              {form.errors}
            </div>
          )}

          <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-md border p-4 gap-4'>
            <legend className='fieldset-legend'>Add Teacher</legend>

            <Field
              field={fields.email}
              name='Email'
              placeholder='Email'
              type='email'
            />

            <Field
              field={fields.password}
              name='Password'
              placeholder='Password'
              type='password'
            />

            <Field
              field={fields.first_name}
              name='First Name'
              placeholder='First Name'
              type='text'
            />

            <Field
              field={fields.last_name}
              name='Last Name'
              placeholder='Last Name'
              type='text'
            />

            <button
              className='btn btn-primary'
              disabled={loading}
              type='submit'
            >
              <Icon name='plus' size='lg' />
              {loading ? 'Adding Teacher...' : 'Add Teacher'}
            </button>
          </fieldset>
        </createTeacher.Form>
      </div>
    </div>
  )
}
