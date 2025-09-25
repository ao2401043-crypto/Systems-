const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Events').setJustify();
table.setHeading('Event Name', 'Loaded Status');

module.exports = (client27) => {
  const events = readdirSync('./events/').filter((file) => file.endsWith('.js'));

  for (const file of events) {
    try {
      const event = require(`../events/${file}`);

      // لازم يكون عندك name و execute داخل ملف الحدث
      if (!event.name || typeof event.execute !== 'function') {
        table.addRow(file, '❌');
        continue;
      }

      if (event.once) {
        client27.once(event.name, (...args) => event.execute(...args, client27));
      } else {
        client27.on(event.name, (...args) => event.execute(...args, client27));
      }

      table.addRow(file, '✔');
    } catch (error) {
      console.error(`Error loading event '${file}':`, error);
      table.addRow(file, '❌');
    }
  }

  console.log(table.toString());
};
