const ROUTE = '/agency'

const paths = {
    index: {
        path: '/'
    },
    profile: {
        path: `${ROUTE}/profile`,
        render: 'users/view/profile.njk'
    },
    signup: { 
        path: `${ROUTE}/signup`, 
        render: 'users/view/signup.njk'
    },
    login: {
        path: `${ROUTE}/login`,
        render: 'users/view/login.njk'
    },
    logout: {
        path: `${ROUTE}/logout`
    }
}

module.exports = paths;
