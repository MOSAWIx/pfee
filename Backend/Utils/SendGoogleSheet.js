const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google.json');
const dotenv = require('dotenv');

dotenv.config();

// const SHEET_ID = process.env.SHEET_ID;

const HEADERS = [
    'Created At',
    'Customer Name',
    'Phone',
    'Note',
    'Product Title',
    'Product ID',
    'Price',
    'city',
    'Quantity',
    'Size',
    'Taille',
    'Status',
    'Color Name',
];

async function sendOrderToGoogleSheet(order,SHEET_ID ) {
    try {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];

        // Try to load header row, and if it fails, set headers
        try {
            await sheet.loadHeaderRow();
        } catch (err) {
            console.warn('⚠️ Header row is empty, setting headers now...');
            await sheet.setHeaderRow(HEADERS);
        }

        const row = {
            'Created At': new Date(order.createdAt).toLocaleString(),
            'Customer Name': order.customer.name,
            'Phone': order.customer.phone,
            'Note': order.customer.note || '',
            'Product Title': order.product.title,
            'Product ID': order.product.id,
            'Price': order.product.price,
            'Quantity': order.quantity,
            'Size': order.size || '',
            'Taille': order.taille || '',
            'city': order.customer.city || '',
            'Status': order.status || '',
            'Color Name': order.color.name,
        };

        await sheet.addRow(row);
        console.log('✅ Order added to Google Sheet');
    } catch (err) {
        console.error('❌ Failed to send order to Google Sheet:', err);
    }
}

module.exports = sendOrderToGoogleSheet;
