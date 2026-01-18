import React from 'react'
import { Form } from 'react-router'
import { supabase } from '../../supabaseClient'

import Icon from '~/components/ui/Icon'
import { useAuthState } from '~/context/AuthContext'

import agent from '../../agent'

export async function action({ request }: { request: Request }) {
  const data = await request.formData()
  console.log('Form Data Submitted:', data)
  return null
}

export async function clientLoader() {
  const { data, error } = await supabase
    .from('student_settings')
    .select('*')
    .eq('id', '49daeb48-11ce-45a1-852d-c8942d26f0a9')
    .single()
  // const data = await agent.StudentSettings.getOne()
  if (error) {
    console.error('Error loading student settings:', error)
    return { data: null, error }
  }

  return { data }
}

function SettingsFieldset({
  children,
  iconName,
  title,
}: {
  children: React.ReactNode
  iconName: string
  title: string
}) {
  return (
    <div className='bg-base-200 p-8 rounded-box'>
      <h2
        className='text-2xl mb-8'
        id={title.toLowerCase().replace(/\s+/g, '-')}
      >
        <Icon name={iconName} /> {title}
      </h2>
      <div className='border-l-4 border-secondary ml-16 pl-8 py-4'>
        {children}
      </div>
    </div>
  )
}

export default function StudentSettingsPage({ loaderData }: any) {
  const { state } = useAuthState()
  // const user_id = state.session?.user.id
  // const settings = loaderData.data

  const [settings, setSettings] = React.useState<any>(loaderData.data)

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked, name, type, value } = event.target
    let updatedValue: any

    if (type === 'checkbox') {
      updatedValue = checked
    } else {
      updatedValue = value
    }

    setSettings({
      ...settings,
      [name]: updatedValue,
    })
    // Update the settings in the database
    // await supabase
    //   .from('StudentSettings')
    //   .update({ [name]: updatedValue })
    //   .eq('id', user_id)
    //   .select()
    //   .single()
    //   .then((response) => {
    //     if (response.error) {
    //       console.error('Error updating settings:', response.error)
    //     } else {
    //       setSettings(response.data)
    //       console.log('Settings updated successfully')
    //       console.log(response.data)
    //     }
    //   })
  }

  return (
    <div className='drawer lg:drawer-open'>
      <input id='settings-sidebar' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content pl-8'>
        {/* Page content here */}
        {/* <h1 className='mb-8 text-3xl'>Manage Account</h1> */}
        {loaderData.error && (
          <div className='alert alert-error mb-4 max-w-3xl mx-auto w-full py-8 flex flex-col gap-8'>
            <b>An error occurred while loading settings.</b>
            Error: {JSON.stringify(loaderData.error)}
          </div>
        )}
        <Form method='post' navigate={false} action='/student/settings'>
          <button className='btn btn-primary mb-4' type='submit'>
            SUBMIT
          </button>
          <div className='flex flex-col gap-8'>
            <SettingsFieldset iconName='eye' title='Appearance'>
              <fieldset className='fieldset'>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    checked={settings?.theme === 'chem-cash-light'}
                    className='radio radio-sm theme-controller'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    type='radio'
                    value='chem-cash-light'
                  />
                  Chem Cash Light
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    checked={settings?.theme === 'retro'}
                    className='radio radio-sm theme-controller'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    type='radio'
                    value='retro'
                  />
                  Retro
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    checked={settings?.theme === 'cyberpunk'}
                    className='radio radio-sm theme-controller'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    type='radio'
                    value='cyberpunk'
                  />
                  Cyberpunk
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    checked={settings?.theme === 'valentine'}
                    className='radio radio-sm theme-controller'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    type='radio'
                    value='valentine'
                  />
                  Valentine
                </label>
                <label className='flex gap-2 cursor-pointer items-center'>
                  <input
                    checked={settings?.theme === 'aqua'}
                    className='radio radio-sm theme-controller'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    type='radio'
                    value='aqua'
                  />
                  Aqua
                </label>
              </fieldset>
            </SettingsFieldset>

            <SettingsFieldset iconName='lock' title='Security'>
              <label className='flex cursor-pointer gap-2'>
                <label className='input validator'>
                  <Icon className='opacity-50' name='key' />
                  <input
                    minLength={8}
                    // name='password'
                    name='theme'
                    onChange={(event) => handleInputChange(event)}
                    // pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                    placeholder='New Password'
                    required
                    title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
                    // type='password'
                    type='text'
                    value={settings?.theme || ''}
                  />
                </label>
                <p className='validator-hint hidden'>
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
              </label>
            </SettingsFieldset>

            <SettingsFieldset iconName='music' title='Songs'>
              <label className='label'>
                <input
                  checked={settings?.anonymousSongRequests || false}
                  className='toggle checked:bg-primary checked:border-primary-content checked:text-primary-content'
                  name='anonymousSongRequests'
                  onChange={(event) => handleInputChange(event)}
                  type='checkbox'
                />
                Anonymous song requests
              </label>
            </SettingsFieldset>
          </div>
        </Form>

        <div className='fab'>
          <label
            htmlFor='settings-sidebar'
            className='btn btn-lg btn-circle btn-primary drawer-button lg:hidden'
          >
            <Icon name='bars' />
          </label>
        </div>
      </div>

      <div className='drawer-side'>
        <label
          htmlFor='settings-sidebar'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <ul className='menu bg-base-300 rounded-box w-80 p-4'>
          {/* Sidebar content here */}
          <h2 className='text-center uppercase text-lg font-bold'>Settings</h2>
          <li>
            <a href='#appearance'>
              <Icon name='eye' /> Appearance
            </a>
          </li>
          <li>
            <a href='#security'>
              <Icon name='lock' /> Security
            </a>
          </li>
          <li>
            <a href='#songs'>
              <Icon name='music' /> Songs
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
