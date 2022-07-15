const gsapi = require("../utils/spreadsheet");
const FuzzifikasiNumberChecking = require("../utils/FuzzifikasiCheck");

const fuzzyTimeSeriesCtrl = {
  getIntervalData: async (req, res) => {
    try {
      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!C:C",
      };

      // Get data from spreadsheet
      let data = await gsapi.spreadsheets.values.get(option);

      // Remove first element of Array
      data.data.values.shift();
      let newData = data.data.values;

      // Merging 2D array into 1D array
      let mergedData = newData.reduce((prev, next) => {
        return prev.concat(next);
      });

      // String to Integer
      let intData = mergedData.map((value) => {
        return Number(value);
      });

      // Find Min and Max from an Array
      let Xmin = Math.min(...intData);
      let Xmax = Math.max(...intData);

      // Pembulatan ke Angka sepuluh terdekat
      let XminRounding = Math.round(Xmin / 10) * 10;
      let XmaxRounding = Math.round(Xmax / 10) * 10;

      // Mencari X1 dan X2
      let X1 = Xmin - XminRounding;
      let X2 = Xmax - XmaxRounding;

      // Cluster
      let cluster = 1 + 3.322 * Math.log10(30);

      // Rounding cluster
      let roundedCluster = Math.round(cluster);

      // Interval
      let interval = (XmaxRounding - XminRounding) / roundedCluster; // 6 diganti menjadi log jika log tidak salah

      // Interval in Universe
      // angka 6 diganti menjadi roundedCluster jika log benar
      let intervalArray = [];
      for (let i = 1; i <= roundedCluster; i++) {
        intervalArray.push(`U${i}`);
      }

      // Menghitung batas Bawah
      let batasBawahArray = [];
      let batasBawah = XminRounding;
      batasBawahArray.push(XminRounding);
      for (let i = 1; i < roundedCluster; i++) {
        batasBawah += interval;
        batasBawahArray.push(batasBawah);
      }

      // Menghitung batas Atas
      let batasAtasArray = [];
      let batasAtas = XminRounding;
      for (let i = 1; i <= 6; i++) {
        batasAtas += interval;
        batasAtasArray.push(batasAtas);
      }

      // Menghitung median dari batas atas dan batas bawah
      let medianArray = [];
      for (let i = 0; i < batasBawahArray.length; i++) {
        let median = (batasBawahArray[i] + batasAtasArray[i]) / 2;
        medianArray.push(median);
      }

      // Mengubah data menjadi objet of array agar bisa di akses di FE
      let newDataArray = [];
      for (let i = 0; i < intervalArray.length; i++) {
        let newData = {
          universe: intervalArray[i],
          batasBawah: batasBawahArray[i],
          batasAtas: batasAtasArray[i],
          median: medianArray[i],
        };
        newDataArray.push(newData);
      }

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
            title: null,
            head: [
              "Interval",
              "Batas Bawah",
              "Batas Atas",
              "Median / Nilai Tengah",
            ],
            body: newDataArray,
            Xmin,
            Xmax,
            X1: Math.abs(X1),
            X2: Math.abs(X2),
            universe: { XminRounding, XmaxRounding },
          },
          message: "Ambil Data Interval Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  getFuzzysetData: async (req, res) => {
    try {
      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!C:C",
      };

      // Get data from spreadsheet
      let data = await gsapi.spreadsheets.values.get(option);

      // Remove first element of Array
      data.data.values.shift();
      let newData = data.data.values;

      // Merging 2D array into 1D array
      let mergedData = newData.reduce((prev, next) => {
        return prev.concat(next);
      });

      // String to Integer
      let intData = mergedData.map((value) => {
        return Number(value);
      });

      // Find Min and Max from an Array
      let Xmin = Math.min(...intData);
      let Xmax = Math.max(...intData);

      // Pembulatan ke Angka sepuluh terdekat
      let XminRounding = Math.round(Xmin / 10) * 10;
      let XmaxRounding = Math.round(Xmax / 10) * 10;

      // Cluster
      let cluster = 1 + 3.322 * Math.log10(30);

      // Rounding cluster
      let roundedCluster = Math.round(cluster);

      // Interval
      let interval = (XmaxRounding - XminRounding) / roundedCluster; // 6 diganti menjadi log jika log tidak salah

      // Interval in Universe
      // angka 6 diganti menjadi roundedCluster jika log benar
      let intervalArray = [];
      for (let i = 1; i <= roundedCluster; i++) {
        intervalArray.push(`A${i}`);
      }

      // Menghitung batas Bawah
      let batasBawahArray = [];
      let batasBawah = XminRounding;
      batasBawahArray.push(XminRounding);
      for (let i = 1; i < roundedCluster; i++) {
        batasBawah += interval;
        batasBawahArray.push(batasBawah);
      }

      // Menghitung batas Atas
      let batasAtasArray = [];
      let batasAtas = XminRounding;
      for (let i = 1; i <= roundedCluster; i++) {
        batasAtas += interval;
        batasAtasArray.push(batasAtas);
      }

      // Mengubah data menjadi aksesable agar bisa di akses di FE
      let newDataArray = [];
      for (let i = 0; i < intervalArray.length; i++) {
        let newData = {
          universe: intervalArray[i],
          batasBawah: batasBawahArray[i],
          batasAtas: batasAtasArray[i],
        };
        newDataArray.push(newData);
      }

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
            title: "FuzzySet",
            head: ["Interval", "Batas Bawah", "Batas Atas"],
            body: newDataArray,
          },
          message: "Ambil Data Fuzzyset Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  getFuzzifikasiData: async (req, res) => {
    try {
      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!B:C",
      };
      const option2 = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!C:C",
      };

      // Get data from spreadsheet
      let data = await gsapi.spreadsheets.values.get(option);
      let data2 = await gsapi.spreadsheets.values.get(option2);

      // Remove first element of Array
      data.data.values.shift();
      let newData = data.data.values;
      data2.data.values.shift();
      let newData2 = data2.data.values;

      // Merging 2D array into 1D array
      let mergedData = newData2.reduce((prev, next) => {
        return prev.concat(next);
      });

      // String to Integer
      let intData = mergedData.map((value) => {
        return Number(value);
      });

      // Find Min and Max from an Array
      let Xmin = Math.min(...intData);
      let Xmax = Math.max(...intData);

      // Pembulatan ke Angka sepuluh terdekat
      let XminRounding = Math.round(Xmin / 10) * 10;
      let XmaxRounding = Math.round(Xmax / 10) * 10;

      // Cluster
      let cluster = 1 + 3.322 * Math.log10(30);

      // Rounding cluster
      let roundedCluster = Math.round(cluster);

      // Interval
      let interval = (XmaxRounding - XminRounding) / roundedCluster; // 6 diganti menjadi log jika log tidak salah

      // Interval in Universe
      // angka 6 diganti menjadi roundedCluster jika log benar
      let intervalArray = [];
      for (let i = 1; i <= roundedCluster; i++) {
        intervalArray.push(`A${i}`);
      }

      // Menghitung batas Bawah
      let batasBawahArray = [];
      let batasBawah = XminRounding;
      batasBawahArray.push(XminRounding);
      for (let i = 1; i < roundedCluster; i++) {
        batasBawah += interval;
        batasBawahArray.push(batasBawah);
      }

      // Menghitung batas Atas
      let batasAtasArray = [];
      let batasAtas = XminRounding;
      for (let i = 1; i <= roundedCluster; i++) {
        batasAtas += interval;
        batasAtasArray.push(batasAtas);
      }

      // Memisahkan 2 value array, dan hanya mengambil data waktu
      let timeDataArray = [];
      newData.map((value) => {
        timeDataArray.push(value[0]);
      });

      // Memisahkan 2 value array, dan hanya mengambil data aktual
      let dataAktualArray = [];
      newData.map((value) => {
        dataAktualArray.push(value[1]);
      });

      // Menggabungkan batas atas dan bawah menjadi 2D array
      let newDataIntervalArray = [];
      for (let i = 0; i < batasBawahArray.length; i++) {
        let newData = [batasBawahArray[i], batasAtasArray[i]];
        newDataIntervalArray.push(newData);
      }

      // Mengubah String menjadi Number / Integer
      let intDataAktualArray = dataAktualArray.map((value) => {
        return Number(value);
      });

      // Menggunakan Function utils FuzzifikasiNumberChecking untuk
      let theData = FuzzifikasiNumberChecking(
        intDataAktualArray,
        newDataIntervalArray
      );

      // Menggabungkan semua Data agar bisa di akses di FE
      let theNewData = [];
      for (let i = 0; i < theData.newDataAktual.length; i++) {
        let data = {
          waktu: timeDataArray[i],
          dataAktual: theData.newDataAktual[i],
          interval: theData.newInterval[i],
          fuzzifikasi: theData.fuzzifikasi[i],
        };
        theNewData.push(data);
      }

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
            title: "Fuzzifikasi",
            head: ["Waktu", "Data Aktual", "Interval", "Fuzzifikasi"],
            body: theNewData,
            // amountOfUi:
          },
          message: "Ambil Data Fuzzfikasi Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  getFLR: async (req, res) => {
    try {
      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!B:C",
      };
      const option2 = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!C:C",
      };

      // Get data from spreadsheet
      let data = await gsapi.spreadsheets.values.get(option);
      let data2 = await gsapi.spreadsheets.values.get(option2);

      // Remove first element of Array
      data.data.values.shift();
      let newData = data.data.values;
      data2.data.values.shift();
      let newData2 = data2.data.values;

      // Merging 2D array into 1D array
      let mergedData = newData2.reduce((prev, next) => {
        return prev.concat(next);
      });

      // String to Integer
      let intData = mergedData.map((value) => {
        return Number(value);
      });

      // Find Min and Max from an Array
      let Xmin = Math.min(...intData);
      let Xmax = Math.max(...intData);

      // Pembulatan ke Angka sepuluh terdekat
      let XminRounding = Math.round(Xmin / 10) * 10;
      let XmaxRounding = Math.round(Xmax / 10) * 10;

      // Cluster
      let cluster = 1 + 3.322 * Math.log10(30);

      // Rounding cluster
      let roundedCluster = Math.round(cluster);

      // Interval
      let interval = (XmaxRounding - XminRounding) / roundedCluster; // 6 diganti menjadi log jika log tidak salah

      // Interval in Universe
      // angka 6 diganti menjadi roundedCluster jika log benar
      let intervalArray = [];
      for (let i = 1; i <= roundedCluster; i++) {
        intervalArray.push(`A${i}`);
      }

      // Menghitung batas Bawah
      let batasBawahArray = [];
      let batasBawah = XminRounding;
      batasBawahArray.push(XminRounding);
      for (let i = 1; i < roundedCluster; i++) {
        batasBawah += interval;
        batasBawahArray.push(batasBawah);
      }

      // Menghitung batas Atas
      let batasAtasArray = [];
      let batasAtas = XminRounding - 1;
      for (let i = 1; i <= roundedCluster; i++) {
        batasAtas += interval;
        batasAtasArray.push(batasAtas);
      }

      // Memisahkan 2 value array, dan hanya mengambil data waktu
      let timeDataArray = [];
      newData.map((value) => {
        timeDataArray.push(value[0]);
      });

      // Memisahkan 2 value array, dan hanya mengambil data aktual
      let dataAktualArray = [];
      newData.map((value) => {
        dataAktualArray.push(value[1]);
      });

      // Menggabungkan batas atas dan bawah menjadi 2D array
      let newDataIntervalArray = [];
      for (let i = 0; i < batasBawahArray.length; i++) {
        let newData = [batasBawahArray[i], batasAtasArray[i]];
        newDataIntervalArray.push(newData);
      }

      // Mengubah String menjadi Number / Integer
      let intDataAktualArray = dataAktualArray.map((value) => {
        return Number(value);
      });

      // Make an index for looping
      let arrayIndex = [];
      for (let i = 0; i < newDataIntervalArray.length; i++) {
        arrayIndex.push(i);
      }

      // Ambil semua data dari functional fuzzifikasi
      let theData = FuzzifikasiNumberChecking(
        intDataAktualArray,
        newDataIntervalArray,
        arrayIndex
      );

      console.log(theData.fuzzifikasi);

      // mengubah data menjadi FLR
      let flrData = [];
      for (let i = 0; i < theData.fuzzifikasi.length; i++) {
        flrData.push([theData.fuzzifikasi[i - 1], theData.fuzzifikasi[i]]);
      }

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
            title: "Fuzzy Logic Relationship",
            head: ["NO", "Fuzzy Logic Relationship (FLR)"],
            body: { flrData },
          },
          message: "Ambil Data FLR Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  getFLRG: async (req, res) => {
    try {
      const option = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!B:C",
      };
      const option2 = {
        spreadsheetId: process.env.SHEET_API,
        range: "Sheet1!C:C",
      };

      // Get data from spreadsheet
      let data = await gsapi.spreadsheets.values.get(option);
      let data2 = await gsapi.spreadsheets.values.get(option2);

      // Remove first element of Array
      data.data.values.shift();
      let newData = data.data.values;
      data2.data.values.shift();
      let newData2 = data2.data.values;

      // Merging 2D array into 1D array
      let mergedData = newData2.reduce((prev, next) => {
        return prev.concat(next);
      });

      // String to Integer
      let intData = mergedData.map((value) => {
        return Number(value);
      });

      // Find Min and Max from an Array
      let Xmin = Math.min(...intData);
      let Xmax = Math.max(...intData);

      // Pembulatan ke Angka sepuluh terdekat
      let XminRounding = Math.round(Xmin / 10) * 10;
      let XmaxRounding = Math.round(Xmax / 10) * 10;

      // Cluster
      let cluster = 1 + 3.322 * Math.log10(30);

      // Rounding cluster
      let roundedCluster = Math.round(cluster);

      // Interval
      let interval = (XmaxRounding - XminRounding) / roundedCluster; // 6 diganti menjadi log jika log tidak salah

      // Interval in Universe
      // angka 6 diganti menjadi roundedCluster jika log benar
      let intervalArray = [];
      for (let i = 1; i <= roundedCluster; i++) {
        intervalArray.push(`A${i}`);
      }

      // Menghitung batas Bawah
      let batasBawahArray = [];
      let batasBawah = XminRounding;
      batasBawahArray.push(XminRounding);
      for (let i = 1; i < roundedCluster; i++) {
        batasBawah += interval;
        batasBawahArray.push(batasBawah);
      }

      // Menghitung batas Atas
      let batasAtasArray = [];
      let batasAtas = XminRounding - 1;
      for (let i = 1; i <= roundedCluster; i++) {
        batasAtas += interval;
        batasAtasArray.push(batasAtas);
      }

      // Memisahkan 2 value array, dan hanya mengambil data waktu
      let timeDataArray = [];
      newData.map((value) => {
        timeDataArray.push(value[0]);
      });

      // Memisahkan 2 value array, dan hanya mengambil data aktual
      let dataAktualArray = [];
      newData.map((value) => {
        dataAktualArray.push(value[1]);
      });

      // Menggabungkan batas atas dan bawah menjadi 2D array
      let newDataIntervalArray = [];
      for (let i = 0; i < batasBawahArray.length; i++) {
        let newData = [batasBawahArray[i], batasAtasArray[i]];
        newDataIntervalArray.push(newData);
      }

      // Mengubah String menjadi Number / Integer
      let intDataAktualArray = dataAktualArray.map((value) => {
        return Number(value);
      });

      // Make an index for looping
      let arrayIndex = [];
      for (let i = 0; i < newDataIntervalArray.length; i++) {
        arrayIndex.push(i);
      }

      // Ambil semua data dari functional fuzzifikasi
      let theData = FuzzifikasiNumberChecking(
        intDataAktualArray,
        newDataIntervalArray,
        arrayIndex
      );

      // mengubah data menjadi FLR
      let flrData = [];
      for (let i = 0; i < theData.fuzzifikasi.length; i++) {
        flrData.push([theData.fuzzifikasi[i - 1], theData.fuzzifikasi[i]]);
      }

      // FLRG SORTING
      let flrgData = [];
      for (let i = 0; i < roundedCluster; i++) {
        let key = `A${i + 1}`;
        let arr = [];
        flrData.forEach((value) => {
          if (value[0] === key || value[1] === key) {
            arr.push(value);
          }
        });
        let data = {
          key,
          arr,
        };
        flrgData.push(data);
      }

      //2D ARR INTO 1D ARR
      let newFLrgData = [];
      flrgData.map((value) => {
        var merged = value.arr.reduce(function (prev, next) {
          return prev.concat(next);
        });
        newFLrgData.push({
          key: value.key,
          data: merged,
        });
      });

      // REMOVING DUPLICATE DATA
      let fixedFLrgData = [];
      newFLrgData.map((value) => {
        var fixedData = value.data.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        fixedFLrgData.push({
          key: value.key,
          data: fixedData,
        });
      });

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
            title: "Fuzzy Logic Relationship Group",
            head: ["NO", "Ui", "Fuzzy Logic Relationship (FLRG)"],
            body: [...fixedFLrgData],
          },
          message: "Ambil Data FLRG Berhasil.",
          error: null,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },
};

module.exports = fuzzyTimeSeriesCtrl;
