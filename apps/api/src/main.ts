import { app } from './app';
import { environment } from './environments/environment';
import { syncModelSchemas } from './app/sequelize';
import { Contact } from './app/models';
import { Gender } from '@myapp/data';

const { port } = environment;
(async () => {
  await syncModelSchemas();
  const contacts = await Contact.findOne({});
  if (!contacts) {
    const numbers = [...Array(50).keys()];
    await Promise.all(
      numbers.map(
        number =>
          new Contact({
            name: `Sanjeev Kumar${number + 1}`,
            email: `sanjeevkumar${number + 1}@email.com`,
            dateOfBirth: new Date(),
            gender: Gender.MALE,
            budget: number + 1
          }).save()
      )
    );

    console.log(`Generated and inserted ${numbers.length} contacts in db`);
  }

  app.listen(port, () => {
    console.log(`Feathers server listening on port ${port}`);
  });
})();

