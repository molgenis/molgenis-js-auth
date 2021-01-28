import '@testing-library/jest-dom'
import fetch from 'isomorphic-unfetch'
import { fireEvent, render } from '@testing-library/vue'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-boost'

import { setupServer } from 'msw/node'
import { graphql } from 'msw'

import { waitFor } from '@testing-library/dom'

import RolesTab from '@/components/RolesTab'
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
          roles: [],
          firstName: 'Henk',
          lastName: 'Example',
          __typename: 'User'
        }
      ] }))
    }),
    graphql.mutation('UpdateRoleMembers', (req, res, ctx) => {
      const { variables } = req
      console.log('variables', variables)
      return res(
        ctx.data({
          updateRoleMembers: variables.userIds.map(userId => ({
            id: userId,
            roles: [variables.roleName],
            __typename: 'User'
          }))
        })
      )
    })
  ]
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Promote existing user', async () => {
  const { findByText, findByRole, getByTestId } = render(RolesTab, {}, localVue => {
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

  const overlay = getByTestId('loading-roles-overlay')
  await waitFor(() => expect(overlay).not.toHaveAttribute('aria-busy', 'true'))

  const su = await findByText('SU')
  fireEvent.click(su)

  const editMembersButton = await findByRole('button', { name: /.*edit members/i })

  await waitFor(() => expect(editMembersButton).toBeEnabled())
  fireEvent.click(editMembersButton)

  const henkCheckbox = await findByRole('checkbox', { name: /henk@example\.org/i })
  fireEvent.click(henkCheckbox)

  const okButton = await findByRole('button', { name: /ok/i })
  expect(okButton).toBeVisible()
  fireEvent.click(okButton)

  const question = await findByText('You are promoting one or more users to super user. Are you sure?')
  await waitFor(() => expect(question).toBeVisible())

  const reallyOk = await findByRole('button', { name: /ok/i })
  await waitFor(() => expect(reallyOk).toBeEnabled())
  fireEvent.click(reallyOk)

  await waitFor(() => expect(question).not.toBeVisible())
  await findByRole('row', { name: /su check henk example \(henk@example\.org\)/i })
})
