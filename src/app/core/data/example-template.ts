export interface ExampleTemplate {
  title: string;
  html: string;
  css: string;
  example_data: any;
}

export const EXAMPLE_TEMPLATES: ExampleTemplate[] = [
  {
    title: 'Payslip',
    html: `<div class="payslip-container">
  <h2 class="title">Payslip</h2>
  <p>ABC Tech Solutions</p>
  <p>Organization number: 123456789</p>
  <p>Address: 123 Main Street, Mumbai, India</p>

  <div class="section grid">
    <div><strong>Employee name:</strong> {{ employee.name }}</div>
    <div><strong>Pay period:</strong> {{ employee.pay_period }}</div>
    <div><strong>Employment status:</strong> {{ employee.status }}</div>
    <div><strong>Pay date:</strong> {{ employee.pay_date }}</div>
    <div><strong>Award/agreement:</strong> {{ employee.agreement }}</div>
    <div><strong>Annual leave balance:</strong> {{ employee.annual_leave }}</div>
    <div><strong>Classification:</strong> {{ employee.role }}</div>
    <div><strong>Sick/carer’s leave balance:</strong> {{ employee.sick_leave }}</div>
    <div><strong>Hourly rate:</strong> {{ employee.hourly_rate }}</div>
    <div><strong>Annual salary:</strong> {{ employee.annual_salary }}</div>
  </div>

  <h3>Entitlements</h3>
  <table>
    <thead>
      <tr><th>Description</th><th>Hours / Units</th><th>Rate</th><th>Total</th></tr>
    </thead>
    <tbody>
      {% for item in entitlements %}
      <tr>
        <td>{{ item.description }}</td>
        <td>{{ item.units }}</td>
        <td>{{ item.rate }}</td>
        <td>{{ item.total }}</td>
      </tr>
      {% endfor %}
      <tr><td colspan="3"><strong>Total</strong></td><td><strong>{{ total_entitlements }}</strong></td></tr>
    </tbody>
  </table>

  <h3>Deductions</h3>
  <table>
    <thead>
      <tr><th>Description</th><th>Total</th></tr>
    </thead>
    <tbody>
      {% for item in deductions %}
      <tr><td>{{ item.description }}</td><td>{{ item.total }}</td></tr>
      {% endfor %}
      <tr><td><strong>Total</strong></td><td><strong>{{ total_deductions }}</strong></td></tr>
    </tbody>
  </table>

  <h3>Net Pay</h3>
  <p><strong>Bank details:</strong> {{ bank.name }}</p>
  <p><strong>Account number:</strong> {{ bank.account }}</p>
  <p><strong>Total net pay:</strong> {{ net_pay }}</p>
</div>

<footer id="pdf-footer"><div class="footer-container">TalenlioTemlate.io</div></footer>`,
    css: `@page {
  margin:0;
  margin-bottom:40px;
  padding:10px;
  background: #E5E0D8;
  @bottom-right {
    content: element(footer-content);
  }
}
#pdf-footer {
  position: running(footer-content);
  width: 100%;
  text-align: center;
  background: #E5E0D8;
}
.footer-container {
  padding:10px;
}
.payslip-container {
  font-family: 'Poppins', sans-serif;
  color: #1f2937;
  background: #E5E0D8;
  padding: 32px;
}
.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}
.section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  margin: 24px 0;
}
h3 {
  margin-top: 32px;
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
th, td {
  border: 1px solid #e5e7eb;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}
th {
  background-color: #f9fafb;
  font-weight: 500;
}`,
    example_data: {
      employee: {
        name: "John Doe",
        pay_period: "01 Jun 2025 – 30 Jun 2025",
        status: "Full time",
        pay_date: "01 Jul 2025",
        agreement: "Tech Industry Award",
        annual_leave: "10 days",
        sick_leave: "5 days",
        role: "Software Engineer",
        hourly_rate: "₹500",
        annual_salary: "₹12,00,000"
      },
      entitlements: [
        {description: "Ordinary hours", units: "160", rate: "₹500", total: "₹80,000"},
        {description: "Bonus", units: "-", rate: "-", total: "₹5,000"},
        {description: "Allowance", units: "-", rate: "-", total: "₹1,000"}
      ],
      total_entitlements: "₹86,000",
      deductions: [
        {description: "Income tax", total: "₹15,000"},
        {description: "PF Contribution", total: "₹3,600"}
      ],
      total_deductions: "₹18,600",
      net_pay: "₹67,400",
      bank: {
        name: "HDFC Bank",
        account: "XXXX-XXXX-9876"
      }
    }
  },
  {
    title: 'Simple Report Cover',
    html: `
<div class="page">
    <!-- All text and logos -->
    <div class="content-wrapper">
        <header class="header">
            <div class="company-info">
                <img src="{{ company.logo_url }}" alt="Company Logo" class="company-logo">
                <span class="company-name">{{ company.name }}</span>
            </div>
            <div class="report-date">{{ report.date }}</div>
        </header>

        <main class="main-content">
            <h1 class="report-title">{{ report.title }}</h1>
            <p class="tagline">{{ report.tagline }}</p>
        </main>

        <!-- Decorative Star Icons -->
        <aside class="star-icons">
            <div class="star-circle star-blue">★</div>
            <div class="star-circle star-green">★</div>
            <div class="star-circle star-yellow">★</div>
        </aside>
    </div>
</div>
`,
    css: `
@page {
  margin:0;
  padding:0;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.page {
    width: 8.5in;
    height: 11in;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
}

.content-wrapper {
    position: relative;
    z-index: 2;
    padding: 50px 60px;
    height: 100%;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.company-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.company-logo {
    width: 40px;
    height: 40px;
}

.company-name {
    font-weight: 700;
    font-size: 18px;
    color: #333;
}

.report-date {
    font-size: 14px;
    color: #555;
}

.main-content {
    margin-top: 50px;
}

.report-title {
    font-size: 48px;
    font-weight: 700;
    color: #16a085; /* Teal Green */
    line-height: 1.2;
    margin: 0;
    max-width: 500px;
}

.tagline {
    margin-top: 30px;
    font-size: 18px;
    color: #333;
    border-left: 5px solid #f1c40f; /* Yellow */
    padding-left: 20px;
}

.star-icons {
    position: absolute;
    top: 120px;
    right: 60px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.star-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.star-blue { background-color: #004a80; }
.star-green { background-color: #16a085; }
.star-yellow { background-color: #f1c40f; }
`,
    example_data: {
      "company": {
        "name": "TechFashion Innovations",
        "logo_url": "https://t3.ftcdn.net/jpg/02/28/18/48/360_F_228184808_BwcnbLZRuqThsuWqDtx8dJRM6CmfLkHN.jpg"
      },
      "report": {
        "title": "SOCIAL MEDIA PERFORMANCE REPORTS",
        "tagline": "Empowering Engagement, Enhancing Reach, Elevating Results",
        "date": "September 2030"
      },
      "illustration_url": "https://t3.ftcdn.net/jpg/02/28/18/48/360_F_228184808_BwcnbLZRuqThsuWqDtx8dJRM6CmfLkHN.jpg"
    }
  },
  {
    title: 'Tax Invoice',
    html: `<div class="invoice-box">
  <header>
    <div class="top-header">
      <div class="gstin-no">GSTIN : {{ company.gstin }}</div>
      <h1 class="invoice-title">Tax Invoice</h1>
      <div class="bill-type">{{ bill_type }}</div>
    </div>
    <div class="company-details">
      <img src="{{ company.logo_url }}" alt="Company Logo" class="logo">
      <div class="company-info">
        <h2>{{ company.name }}</h2>
        <p>{{ company.store_type }}</p>
        <p>{{ company.address }}</p>
        <p>Contact No. : {{ company.contact }}</p>
      </div>
    </div>
  </header>

  <section class="customer-invoice-details">
    <div class="customer-info">
      <div class="info-block bill-to">
        <div class="block-header">Bill To</div>
        <p><strong>Name :</strong> {{ customer.bill_to.name }}</p>
        <p><strong>Address :</strong> {{ customer.bill_to.address }}</p>
        <p><strong>State :</strong> {{ customer.bill_to.state }}</p>
        <p><strong>GSTIN :</strong> {{ customer.bill_to.gstin }}</p>
      </div>
      <div class="info-block ship-to">
        <div class="block-header">Ship To</div>
        <p><strong>Name :</strong> {{ customer.ship_to.name }}</p>
        <p><strong>Address :</strong> {{ customer.ship_to.address }}</p>
        <p><strong>State :</strong> {{ customer.ship_to.state }}</p>
        <p><strong>GSTIN :</strong> {{ customer.ship_to.gstin }}</p>
      </div>
    </div>
    <div class="invoice-meta">
      <div class="meta-row"><span># Inv. No. :</span><span>{{ invoice.number }}</span></div>
      <div class="meta-row"><span>Inv. Date :</span><span>{{ invoice.date }}</span></div>
      <div class="meta-row"><span>Payment Mode :</span><span>{{ invoice.payment_mode }}</span></div>
      <div class="meta-row"><span>Reverse Charge :</span><span>{{ invoice.reverse_charge }}</span></div>
      <div class="meta-row spacer"></div>
      <div class="meta-row"><span>Buyer's Order No :</span><span>{{ invoice.buyers_order_no }}</span></div>
      <div class="meta-row"><span>Supplier's Ref. :</span><span>{{ invoice.suppliers_ref }}</span></div>
      <div class="meta-row"><span>Vehicle Number :</span><span>{{ invoice.vehicle_number }}</span></div>
      <div class="meta-row"><span>Delivery Date :</span><span></span></div>
      <div class="meta-row"><span>Transport Details :</span><span></span></div>
      <div class="meta-row"><span>Terms Of Delivery :</span><span></span></div>
    </div>
  </section>

  <table class="items-table">
    <thead>
      <tr>
        <th>Sr</th>
        <th>Goods & Service Discription</th>
        <th>HSN</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Taxable</th>
        <th colspan="2">GST</th>
        <th>Total</th>
      </tr>
      <tr class="gst-header">
        <td colspan="6"></td>
        <td>%</td>
        <td>Amt.</td>
        <td></td>
      </tr>
    </thead>
    <tbody>
      {% for item in items %}
      <tr>
        <td>{{ item.sr }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.hsn }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.rate }}</td>
        <td>{{ item.taxable }}</td>
        <td>{{ item.gst_percent }}</td>
        <td>{{ item.gst_amount }}</td>
        <td>{{ item.total }}</td>
      </tr>
      {% endfor %}
    </tbody>
    <tfoot>
      <tr class="sub-total">
        <td colspan="3"><strong>Sub-Total</strong></td>
        <td><strong>{{ totals.sub_total_quantity }}</strong></td>
        <td></td>
        <td><strong>{{ totals.sub_total_taxable }}</strong></td>
        <td></td>
        <td><strong>{{ totals.sub_total_gst }}</strong></td>
        <td><strong>{{ totals.sub_total_amount }}</strong></td>
      </tr>
    </tfoot>
  </table>

  <section class="footer-details">
    <div class="bank-declaration">
      <div class="bank-details">
        <strong>Our Bank Details</strong>
        <p>Bank Name : <span>{{ bank_details.name }}</span></p>
        <p>Branch : <span>{{ bank_details.branch }}</span></p>
        <p>Account No : <span>{{ bank_details.account_no }}</span></p>
        <p>IFSC Code : <span>{{ bank_details.ifsc }}</span></p>
        <p>UPI ID : <span>{{ bank_details.upi }}</span></p>
      </div>
      <div class="total-in-words">
        <strong>Invoice Total in Word</strong>
        <p>{{ total_in_words }}</p>
      </div>
      <div class="declaration">
        <strong>Declaration</strong>
        {% for line in declarations %}
          <p>{{ loop.index }}. {{ line }}</p>
        {% endfor %}
        <p>E. & O.E.</p>
      </div>
    </div>
    <div class="summary-signature">
      <table class="summary-table">
        <thead>
          <tr>
            <th>SUMMARY</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>CGST Amt:</td><td>{{ summary.cgst }}</td></tr>
          <tr><td>SGST Amt:</td><td>{{ summary.sgst }}</td></tr>
          <tr><td>IGST Amt:</td><td>{{ summary.igst }}</td></tr>
          <tr><td>Freight Packing Charges:</td><td>{{ summary.freight }}</td></tr>
          <tr><td>Round off:</td><td>{{ summary.round_off }}</td></tr>
          <tr class="total-amount">
            <td><strong>Total Amount:</strong></td>
            <td><strong>{{ summary.total_amount }}</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="signature-block">
        <div class="qr-code">
          <img src="{{ qr_code_url }}" alt="QR Code">
        </div>
        <div class="signature-text">
          <p>For, <strong>{{ company.name }}</strong></p>
          <br><br><br>
          <p>Authorised Signatory</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="thank-you-note">
    Thank You For Business With US!
  </footer>
</div>
`,
    css: `
    @page {
  margin:0;
  padding:0;
}
body {
  background-color: #e0e0e0;
  font-family: Arial, sans-serif;
  font-size: 11px;
  color: #333;
}
.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 5px;
}
.invoice-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}
.gstin-no, .bill-type { font-size: 11px; }
.company-details {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.logo { width: 60px; height: auto; margin-right: 15px; }
.company-info h2 {
  margin: 0 0 2px 0;
  font-size: 18px;
  font-weight: bold;
}
.company-info p { margin: 0; line-height: 1.4; }
.customer-invoice-details {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.customer-info, .invoice-meta {
  width: 50%;
  padding: 5px;
}
.customer-info { border-right: 1px solid #ddd; }
.info-block {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}
.info-block:last-child { border-bottom: none; }
.block-header {
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 3px 5px;
  margin-bottom: 5px;
}
.info-block p { margin: 2px 0; }
.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 5px;
}
.meta-row.spacer { height: 20px; }
.meta-row span:first-child { font-weight: bold; }
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.items-table th, .items-table td {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: center;
}
.items-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.items-table thead .gst-header td {
  font-weight: bold;
  background-color: #f2f2f2;
  border-top: none;
}
.items-table td:nth-child(2) { text-align: left; }
.items-table tfoot .sub-total td {
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 8px 5px;
}
.footer-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.bank-declaration { width: 65%; border: 1px solid #ddd; padding: 5px; }
.bank-details, .total-in-words, .declaration { margin-bottom: 10px; }
.bank-details p, .declaration p { margin: 2px 0; }
.summary-signature { width: 34%; }
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.summary-table th, .summary-table td {
  border: 1px solid #ddd;
  padding: 5px;
}
.summary-table th { background-color: #f2f2f2; text-align: left; }
.summary-table td:last-child { text-align: right; }
.summary-table .total-amount td {
  background-color: #f2f2f2;
  font-weight: bold;
  font-size: 12px;
}
.signature-block { display: flex; align-items: flex-end; justify-content: space-between; padding-top: 10px; }
.qr-code img { width: 70px; height: 70px; }
.signature-text { text-align: center; }
.signature-text p { margin: 0; }
.thank-you-note {
  text-align: center;
  font-style: italic;
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 5px;
}
`,
    example_data: {
      company: {
        name: "SUNRISE ENTERPRISE",
        logo_url: "https://images.stockcake.com/public/7/9/e/79ea7fa0-e580-45c1-82b4-adc4436b035e_large/sunrise-mountain-view-stockcake.jpg",
        store_type: "General Store - Lorem-181005",
        address: "# S-50, 3rd Cross PTC Building, I.T. Estate, New Lorem-1358XX",
        contact: "+91-985689XXX9, +91- 98458XXX38",
        gstin: "07BGUPD3647XXXX",
      },
      bill_type: "Original / Duplicate Bill",
      customer: {
        bill_to: {
          name: "Lorem Ipsum",
          address: "# S-50, 3rd PTC Building, I.T. Estate, Lorem-1358XX",
          state: "Ipsum - 07",
          gstin: "HVBADAXX456",
        },
        ship_to: {
          name: "Lorem Ipsum",
          address: "# S-50, 3rd PTC Building, I.T. Estate, Lorem-1358XX",
          state: "Ipsum - 07",
          gstin: "HVBADAXX456",
        },
      },
      invoice: {
        number: "Inv-5",
        date: "10-01-25",
        payment_mode: "UPI",
        reverse_charge: "YES",
        buyers_order_no: "B4589",
        suppliers_ref: "S145",
        vehicle_number: "V1456",
      },
      items: [
        {
          sr: 1,
          description: "Optimus Ball Pen",
          hsn: 1495,
          quantity: "2 Nos",
          rate: "10.00",
          taxable: "20.00",
          gst_percent: "12%",
          gst_amount: "2.40",
          total: "22.40"
        },
        {
          sr: 2,
          description: "Executive Diary",
          hsn: 1256,
          quantity: "8 Box",
          rate: "590.00",
          taxable: "4720.00",
          gst_percent: "12%",
          gst_amount: "566.40",
          total: "5,286.40"
        },
        {
          sr: 3,
          description: "Leather Portfolio Folder",
          hsn: 1258,
          quantity: "2 Box",
          rate: "630.00",
          taxable: "1260.00",
          gst_percent: "12%",
          gst_amount: "151.20",
          total: "1,411.20"
        },
        {
          sr: 4,
          description: "Wireless Mouse",
          hsn: 4589,
          quantity: "9 Nos",
          rate: "520.00",
          taxable: "4680.00",
          gst_percent: "18%",
          gst_amount: "842.40",
          total: "5,522.40"
        },
        {
          sr: 5,
          description: "A4 Document File",
          hsn: 4587,
          quantity: "5 Pkt",
          rate: "420.00",
          taxable: "2100.00",
          gst_percent: "12%",
          gst_amount: "252.00",
          total: "2,352.00"
        },
        {
          sr: 6,
          description: "Power Bank 10000mAh",
          hsn: 1248,
          quantity: "9 Nos",
          rate: "570.00",
          taxable: "5130.00",
          gst_percent: "12%",
          gst_amount: "615.60",
          total: "5,745.60"
        },
        {
          sr: 7,
          description: "USB Flash Drive",
          hsn: 1256,
          quantity: "12 Pkt",
          rate: "999.00",
          taxable: "11988.00",
          gst_percent: "18%",
          gst_amount: "2157.84",
          total: "14,145.84"
        },
        {
          sr: 8,
          description: "Bluetooth Keyboard",
          hsn: 2536,
          quantity: "4 Box",
          rate: "750.00",
          taxable: "3000.00",
          gst_percent: "18%",
          gst_amount: "540.00",
          total: "3,540.00"
        }
      ],
      totals: {
        sub_total_quantity: 51,
        sub_total_taxable: "32898",
        sub_total_gst: "5127.84",
        sub_total_amount: "38025.84",
      },
      bank_details: {
        name: "BANK OF LOREM IPSUM",
        branch: "DOLOR",
        account_no: "20412XXXXX05",
        ifsc: "SBIN003XXXX",
        upi: "yourid@upi",
      },
      total_in_words: "Rupees ThirtyEight Thousand TwentySix Only",
      declarations: [
        "Subject to Mehsana jurisdiction",
        "Terms & conditions are subject to our trade policy",
        "Our risk & responsibility ceases after the delivery of goods."
      ],
      summary: {
        cgst: "2563.92",
        sgst: "2563.92",
        igst: "",
        freight: "",
        round_off: "0.16",
        total_amount: "38026.00",
      },
      qr_code_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/500px-QR_code_for_mobile_English_Wikipedia.svg.png"
    }
  }
] as ExampleTemplate[];

