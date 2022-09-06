const gsapi = require("../utils/spreadsheet");

const dataAktualCtrl = {
  getDataAktual: async (req, res) => {
    try {
      const param = req.params;

      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!A:C",
      };

      let data = await gsapi.spreadsheets.values.get(option);

      data.data.values.shift();

      if (!data) {
        return res.status(500).json({
          status: false,
          data: null,
          message: "Data doesnt exists.",
          error: null,
        });
      } else {
        res.status(200).json({
          status: true,
          data: {
            head: ["No", "Date", "waktu", "Konsentrasi CO"],
            body: data.data.values,
          },
          message: "Ambil Data Aktual Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },
};

module.exports = dataAktualCtrl;
