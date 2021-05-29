const AbstractCarsRepository = require('../orm/abstract/abstractCarsRepository');
const AbstractRepositoryError = require('../orm/error/abstractRepositoryError');

test('No se puede instanciar un repositorio abstracto', () => {
    let repositoryInstance;
    try {
        repositoryInstance = new AbstractCarsRepository();
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractRepositoryError);
    } finally {
        expect(repositoryInstance).toBeUndefined();
    }
});

test('Se puede instanciar un repositorio concreto que herede del repositorio abstracto', () => {
    const ConcreteRepository = class extends AbstractCarsRepository {};
    const repositoryInstance = new ConcreteRepository();
    expect(repositoryInstance).toBeInstanceOf(ConcreteRepository);
    expect(repositoryInstance).toBeInstanceOf(AbstractCarsRepository);
});
