const ROUTE = '/agency';

const paths = {
    index: `${ROUTE}/`,
    create: {
        path: `${ROUTE}/create/client`,
        render: 'clients/view/form.njk',
    }
}

module.exports = { paths };
