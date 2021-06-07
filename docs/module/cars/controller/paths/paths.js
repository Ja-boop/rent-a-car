const ROUTE = '/agency'

const paths = {
    list: {
        path: `${ROUTE}/car/list`,
        render: 'cars/view/list.njk',
    },
    create: {
        path: `${ROUTE}/create/car`,
        render: 'cars/view/form.njk',
    },
    delete: {
        path: `${ROUTE}/delete/car/:id`,
    },
    update: {
        path: `${ROUTE}/view/car/:id`,
    }
}

module.exports = { paths };
