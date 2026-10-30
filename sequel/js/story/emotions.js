// Which of Alan's lines show an emotion on his face (js/engine/faces.js draws it). Approved by the user on the review
// page, 2026-10-29 (33 of 34 proposed; "don't overuse them... in most cases he will just have his regular face").
// The face shows the emotion while the line is spoken and for a moment after; never while he walks.
(function () {
  const E = window.Engine;
  const TAGS = {
    joy: ['alan_su_vasco_1', 'alan_m_after', 'alan_su_out_1'],
    mischievous: ['alan_t_flirt_surfer', 'alan_t_flirt_chano', 'alan_t_flirt_monte', 'alan_t_swell', 'alan_claim_blazer', 'alan_surf_4', 'alan_t_walk_3', 'alan_derek_rope', 'alan_rafa_rum',
      'alan_bg_beach_surfer_wax', 'alan_bg_canteras_german_tourist', 'alan_bg_restaurant_waiter', 'alan_bg_quay_crate_carrier_mercado', 'alan_bg_museum_waiter_tray', 'alan_bg_museum_guest_linen'],
    embarrassed: ['alan_t_shy_cand', 'alan_t_shy_gail', 'alan_t_shy_nieves', 'alan_t_burnt', 'alan_look_nieves_sat', 'alan_s_wake_2', 'alan_sat_nieves', 'alan_caught_1',
      'alan_bg_cathedral_tourist_mercado', 'alan_bg_museum_cocktail_pair', 'alan_bg_museum_guest_pearls', 'alan_bg_vegueta_tourists_guidebook'],
    surprise: ['alan_look_bell_mark', 'alan_look_nets_wed'],
    concern: ['alan_t_call_2', 'alan_s_vasco', 'alan_su_where', 'alan_su_idiot', 'alan_m_ask_hurt'],
    sadness: ['alan_call_sat_1', 'alan_s_truth_3', 'alan_m_plain', 'alan_look_elena_box', 'alan_look_drawing'],
    fear: ['alan_call_tue_1', 'alan_call_tue_3b', 'alan_look_sea_5', 'alan_lr_feet', 'alan_lr_footwell', 'alan_look_door_in'],
    anger: ['alan_th_desk_2', 'alan_read_sketchbook_2', 'alan_f_4'],
  };
  for (const [e, ids] of Object.entries(TAGS)) for (const id of ids) E.LINE_EMO[id] = e;
})();
