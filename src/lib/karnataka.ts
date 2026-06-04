// Karnataka districts and a representative subset of taluks.
// Full list can be extended later — covers the South East Teachers Constituency.

export const KARNATAKA_DISTRICTS: Record<string, string[]> = {
  'Bengaluru Urban': ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal', 'Yelahanka'],
  'Bengaluru Rural': ['Devanahalli', 'Doddaballapur', 'Hosakote', 'Nelamangala'],
  'Ramanagara': ['Ramanagara', 'Channapatna', 'Kanakapura', 'Magadi'],
  'Kolar': ['Kolar', 'Bangarpet', 'Malur', 'Mulbagal', 'Srinivaspur'],
  'Chikkaballapur': ['Chikkaballapur', 'Bagepalli', 'Chintamani', 'Gauribidanur', 'Gudibanda', 'Sidlaghatta'],
  'Tumakuru': ['Tumakuru', 'Chiknayakanhalli', 'Gubbi', 'Koratagere', 'Kunigal', 'Madhugiri', 'Pavagada', 'Sira', 'Tiptur', 'Turuvekere'],
  'Mandya': ['Mandya', 'Maddur', 'Malavalli', 'Nagamangala', 'Pandavapura', 'Krishnarajpet', 'Srirangapatna'],
  'Mysuru': ['Mysuru', 'Hunsur', 'KR Nagar', 'Nanjangud', 'Periyapatna', 'TN Pura', 'HD Kote'],
  'Chamarajanagar': ['Chamarajanagar', 'Gundlupet', 'Kollegal', 'Yelandur'],
  'Hassan': ['Hassan', 'Arsikere', 'Alur', 'Belur', 'Channarayapatna', 'Holenarsipur', 'Sakleshpur'],
  'Kodagu': ['Madikeri', 'Somwarpet', 'Virajpet'],
  'Dakshina Kannada': ['Mangaluru', 'Bantwal', 'Belthangady', 'Puttur', 'Sullia'],
  'Udupi': ['Udupi', 'Karkala', 'Kundapura'],
  'Uttara Kannada': ['Karwar', 'Sirsi', 'Yellapur', 'Honnavar', 'Bhatkal', 'Kumta'],
  'Shivamogga': ['Shivamogga', 'Bhadravathi', 'Hosanagara', 'Sagara', 'Shikaripura', 'Sorab', 'Tirthahalli'],
  'Davanagere': ['Davanagere', 'Channagiri', 'Harihar', 'Honnali', 'Jagalur'],
  'Chitradurga': ['Chitradurga', 'Challakere', 'Hiriyur', 'Holalkere', 'Hosadurga', 'Molakalmuru'],
  'Ballari': ['Ballari', 'Hosapete', 'Sandur', 'Siruguppa', 'Kudligi'],
  'Vijayanagara': ['Hosapete', 'Hagaribommanahalli', 'Hadagali'],
  'Raichur': ['Raichur', 'Devadurga', 'Lingsugur', 'Manvi', 'Sindhanur'],
  'Koppal': ['Koppal', 'Gangavathi', 'Kushtagi', 'Yelburga'],
  'Kalaburagi': ['Kalaburagi', 'Afzalpur', 'Aland', 'Chincholi', 'Chittapur', 'Sedam', 'Jevargi'],
  'Bidar': ['Bidar', 'Aurad', 'Basavakalyan', 'Bhalki', 'Humnabad'],
  'Yadgir': ['Yadgir', 'Shahapur', 'Shorapur'],
  'Vijayapura': ['Vijayapura', 'Basavana Bagewadi', 'Indi', 'Muddebihal', 'Sindgi'],
  'Bagalkote': ['Bagalkote', 'Badami', 'Bilgi', 'Hungund', 'Jamkhandi', 'Mudhol'],
  'Belagavi': ['Belagavi', 'Athani', 'Bailhongal', 'Chikkodi', 'Gokak', 'Hukkeri', 'Khanapur', 'Raibag', 'Ramdurg', 'Saundatti'],
  'Dharwad': ['Dharwad', 'Hubballi', 'Kalghatgi', 'Kundgol', 'Navalgund'],
  'Gadag': ['Gadag', 'Mundargi', 'Nargund', 'Ron', 'Shirahatti'],
  'Haveri': ['Haveri', 'Byadgi', 'Hangal', 'Hirekerur', 'Ranebennur', 'Savanur', 'Shiggaon'],
  'Chikkamagaluru': ['Chikkamagaluru', 'Kadur', 'Koppa', 'Mudigere', 'NR Pura', 'Sringeri', 'Tarikere'],
};

export const KARNATAKA_DISTRICT_LIST = Object.keys(KARNATAKA_DISTRICTS).sort();
