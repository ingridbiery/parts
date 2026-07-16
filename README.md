After cloning the repository:
* To install dependencies run: npm install
* And for the client: cd client && npm install && cd ..
* To set up the database, run: echo 'DATABASE_URL="file:./dev.db"' > .env
* Then run: npx prisma migrate dev --name init
* To seed the database, run: npx prisma db seed
* To start the server, run: node server/index.js
* To start the client, run: cd client && npm run dev

I created a very basic database schema that could handle inventory and orders
* Parts: id, part_number, name, price
* Inventory: id, number, part
* Contractor: id, name
* Order: id, amount, status (PENDING< PROCESSING, SHIPPING, ARRIVED), contractor, part, createdAt, updatedAt

The contractor will want to see their orders, with instant update.
The distributor will want to see all orders with the ability to update their status. The distributor can also see all parts and the remaining inventory.

Error cases of not selecting an item to order, or entering a negative number, 0, or a decimal are handled with a tooltip message (I'm not sure if that's the correct terminology). If the server determines that the order is for more than there is stock, an error message will appear on the client view.

Given more time, the following issues would be addressed:
* contractors would sign up for an account with an email and password rather than just choosing themselves from a drop-down
* the contractor would have a shopping cart that would include total cost including tax and shipping, and payment processing
* it would be possible to add a new contractor
* the distributor would be able to update inventory amounts
* the distributor would be able to update prices
* the distributor would be able to filter on orders types
* inventory amount would automatically update when and order is placed
* contractors and distributors would have the ability to cancel orders, with associated update to inventory
* the views would be more attractive
* I would add automated tests
* after that, we could consider subscription orders, promotions for items with high inventory, mailing lists, recognizing clients with high sales, etc.
