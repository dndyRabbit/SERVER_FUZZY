function FuzzifikasiNumberChecking(dataAktual, intervals) {
  let newInterval = [];
  let fuzzifikasi = [];
  let newDataAktual = [];

  dataAktual.forEach((aktual) => {
    for (let i = 0; i < intervals.length; i++) {
      if (intervals[i][0] <= aktual && intervals[i][1] >= aktual) {
        newInterval.push([intervals[i][0], intervals[i][1]]);
        fuzzifikasi.push(`A${i + 1}`);
        newDataAktual.push(aktual);
      }
    }
  });

  let newData = {
    newInterval,
    fuzzifikasi,
    newDataAktual,
  };
  return newData;
}

module.exports = FuzzifikasiNumberChecking;
