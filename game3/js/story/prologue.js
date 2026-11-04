(function () {
  const S = window.S, { G, F, say } = S;
  S.START[0] = async () => { S.becomeCatalina(); await G.goRoom('p1586_river_mouth', null, { instant: true, noEnter: true }); await S.day(0); await G.fade(false); };
})();
