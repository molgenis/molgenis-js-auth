import '@testing-library/jest-dom'
import fetch from 'isomorphic-unfetch'
import { fireEvent, render } from '@testing-library/vue'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-boost'

import { setupServer } from 'msw/node'
import { graphql } from 'msw'

import { waitFor, within } from '@testing-library/dom'

import UsersTab from '@/components/UsersTab'
import {
  BootstrapVue,
  BIcon,
  BIconSearch,
  BIconCheck,
  BIconX,
  BIconPersonFill,
  BIconPersonPlusFill,
  BIconPersonDashFill,
  BIconPersonLinesFill,
  BIconPeopleFill,
  BIconJournals,
  BIconJournalPlus,
  BIconJournalMinus,
  BIconJournalText
} from 'bootstrap-vue'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3020/graphql',
  cache: new InMemoryCache(),
  fetch
})

const server = setupServer(
  ...[
    graphql.query('Roles', (_req, res, ctx) => {
      return res(ctx.data({ roles: [
        { id: '1', name: 'SU', isSuperRole: true, __typename: 'Role' },
        { id: '2', name: 'FOO_RESEARCHER', isSuperRole: false, __typename: 'Role' },
        { id: '3', name: 'BAR_RESEARCHER', isSuperRole: false, __typename: 'Role' }
      ] }))
    }),
    graphql.query('RegisteredUsers', (_req, res, ctx) => {
      return res(ctx.data({ registeredUsers: [
        {
          id: '1',
          email: 'henk@example.org',
          roles: ['FOO_RESEARCHER'],
          firstName: 'Henk',
          lastName: 'Example',
          __typename: 'User'
        }
      ] }))
    }),
    graphql.mutation('UpdateUserRoles', (req, res, ctx) => {
      const { variables } = req
      return res(
        ctx.data({
          updateUserRoles: {
            id: variables.userId,
            roles: variables.roles,
            __typename: 'User'
          }
        })
      )
    })
  ]
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Promote existing user', async () => {
  const { findByText, findByRole, findByLabelText, getByRole } = render(UsersTab, {}, localVue => {
    localVue.use(VueApollo)
    localVue.use(BootstrapVue)
    localVue.component('BIcon', BIcon)
    localVue.component('BIconSearch', BIconSearch)
    localVue.component('BIconCheck', BIconCheck)
    localVue.component('BIconX', BIconX)
    localVue.component('BIconPersonFill', BIconPersonFill)
    localVue.component('BIconPersonPlusFill', BIconPersonPlusFill)
    localVue.component('BIconPersonDashFill', BIconPersonDashFill)
    localVue.component('BIconPersonLinesFill', BIconPersonLinesFill)
    localVue.component('BIconPeopleFill', BIconPeopleFill)
    localVue.component('BIconJournals', BIconJournals)
    localVue.component('BIconJournalPlus', BIconJournalPlus)
    localVue.component('BIconJournalMinus', BIconJournalMinus)
    localVue.component('BIconJournalText', BIconJournalText)

    return {
      apolloProvider: new VueApollo({ defaultClient: apolloClient })
    }
  })

  const henk = await findByText('henk@example.org')
  fireEvent.click(henk)

  const editRolesButton = await findByRole('button', { name: /edit roles/i })

  await waitFor(() => expect(editRolesButton).toBeEnabled())
  fireEvent.click(editRolesButton)

  const suCheckbox = await findByLabelText('SU')
  expect(suCheckbox).toBeInTheDocument()
  fireEvent.click(suCheckbox)

  const okButton = await findByRole('button', { name: /ok/i })
  expect(okButton).toBeInTheDocument()
  fireEvent.click(okButton)

  await findByText('Are you sure you want to make henk@example.org a super user?')

  const reallyOk = await findByRole('button', { name: /ok/i })
  await waitFor(() => expect(reallyOk).toBeEnabled())
  fireEvent.click(reallyOk)

  const table = getByRole('table')
  const suRole = await within(table).findByText('SU')
  expect(suRole).toBeVisible()
})
