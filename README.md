After cloning the repository:
* To install dependencies run: npm install
* To initialize the database, run: npx prisma migrate dev --name init
* To seed the database, run: npx prisma db seed
* To start the server, run: node server/index.js
* To start the client, run: npm run dev

I have done full stack development before, but only in Drupal and Ruby on Rails, both of which do a lot of the work behind the scenes. So, I had to spend some time installing the right tools to attack this problem. It was fun and I learned a lot, but there's so much more I would do if I had more time.

I created a very basic database schema that could handle inventory (parts and quantities). Then I added the idea of orders (part, quantity, and status of PENDING, PROCESSING, SHIPPING, and ARRIVED). The distributor will want to see all orders and update their status. The contractor will see only their own orders and be able to place new orders. This is such a bare bones approach. Contractors choose themselves from a drop-down menu rather than having an actual login with security. They can't sort or filter their orders. Distributors can sort, but not filter their views. These are issues that would be addressed if I had more time. The views are also very plain. Inventory amounts cannot be updated, either automatically when orders are placed, or through a distributor dashboard.

Error cases of not selecting an item to order, or entering a negative number, 0, or a decimal are handled with a tooltip message (I'm not sure if that's the correct terminology). If the server determines that the order is for more than there is stock, an error message will appear on the page.

Given more time, the following issues would be addressed:
* contractor email, login, authorization
* ability to add new contractor
* distributor ability to update inventory amounts
* distributor ability to filter on orders types
* automatic inventory update when shipping
* ability to cancel orders
* show when an order moved from one status to another
* make the views more attractive
* automated tests
