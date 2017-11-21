function getCurrentBidTextFromAuction(auction) {
  if (auction.bids.length != 0) {
    return "Current bid $" + getCurrentBidFromAuction(auction);
  } else if (auction.min_price) {
    return "Minimum price $" + auction.min_price;
  } else {
    return "N/A";
  }
}

function getCurrentBidFromAuction(auction) {
  if (auction.bids.length != 0) {
    var currentBid = 0;
    for (var i = 0; i < auction.bids.length; i++) {
      currentBid = Math.max(currentBid, auction.bids[i].newBid);
    }
    return currentBid;
  } else if (auction.min_price) {
    return auction.min_price;
  }
  return -1;
}

function getTimeRemainingFromAuction(auction) {
  let totalSecs = parseInt((auction.unix_end_time - new Date().getTime()) / 1000);
  let hours = parseInt(totalSecs / 3600);
  let minutes = parseInt((totalSecs % 3600) / 60);
  let ret = hours == 0 ? "" : hours == 1 ? "1 hour, " : hours + " hours, ";
  return ret + (minutes == 1 ? "1 minute left" : minutes + " minutes left");
}
