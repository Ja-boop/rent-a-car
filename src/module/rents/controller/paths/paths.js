const ROUTE = '/agency';

const paths = {
    login: {
        path: `${ROUTE}/login`,
    },
    index: { 
        path: `${ROUTE}/`,
        render: 'views/home.njk',
    },
    list: {
        path: `${ROUTE}/rent/car/list`,
        render: 'cars/view/list.njk',
    },
    create: {
        path: `${ROUTE}/rent/car/:id`,
        render: 'rents/view/reserveCar.njk',
    },
    reserve: {
        client: {
            selector: {
                path: `${ROUTE}/reserve/client/selector`,
                render: 'rents/view/userSelector.njk',
            }
        },
        list: {
            path: `${ROUTE}/reserve/:id/list`,
            render: 'rents/view/userCars.njk',
            redirect: (id) => {
                return `${ROUTE}/reserve/${id}/list`
            }
        },
        delete: {
            path: `${ROUTE}/reserve/:id/delete`,
            redirect: (id) => {
                return `${ROUTE}/reserve/${id}/list`
            }
        },
        update: {
            path: `${ROUTE}/reserve/:id/view`,
            render: 'rents/view/updateReserve.njk',
        },
    }
}

module.exports = { paths };
