import { useRouter } from 'next/router'

export default {
  logo: <span>Buildog</span>,
  project: {
    link: 'https://github.com/buildog-dev/buildog'
  },
  docsRepositoryBase: 'https://github.com/buildog-dev/buildog/tree/main/apps/docs',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Buildog'
      }
    }
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} ©{' '}
        Buildog
      </span>
    )
  },
  navigation: true, 

  // ... other theme options
}
