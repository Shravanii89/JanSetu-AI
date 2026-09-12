import assert from "node:assert";
import { formatReverseGeocodeAddress } from "../components/location/LocationPicker";

console.log("Starting Location Address Formatter Tests...\n");

// Test 1: Example 1 from requirement: "FC Road, Shivajinagar, Pune"
const mockFcRoad = {
  address: {
    road: "FC Road",
    suburb: "Shivajinagar",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
  },
};
const res1 = formatReverseGeocodeAddress(mockFcRoad);
console.log("Test 1 (FC Road, Shivajinagar):", res1);
assert.strictEqual(res1, "FC Road, Shivajinagar, Pune");

// Test 2: Example 2 from requirement: "Alandi Road, Dighi, Pune"
const mockAlandiRoad = {
  address: {
    road: "Alandi Road",
    suburb: "Dighi",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
  },
};
const res2 = formatReverseGeocodeAddress(mockAlandiRoad);
console.log("Test 2 (Alandi Road, Dighi):", res2);
assert.strictEqual(res2, "Alandi Road, Dighi, Pune");

// Test 3: Hierarchy with Street + Landmark + Locality + City
const mockWithLandmark = {
  address: {
    house_number: "42",
    road: "Baner Road",
    amenity: "Balewadi Phata Cafe",
    suburb: "Baner",
    city: "Pune",
  },
};
const res3 = formatReverseGeocodeAddress(mockWithLandmark);
console.log("Test 3 (With Landmark & House Number):", res3);
assert.ok(res3.startsWith("42, Baner Road"));
assert.ok(res3.includes("Balewadi Phata"));
assert.ok(res3.includes("Baner"));
assert.ok(res3.includes("Pune"));

// Test 4: Known Pune Pincode locality fallback (412105 -> Alandi)
const mockPincodeAlandi = {
  address: {
    postcode: "412105",
    city: "Pune",
  },
};
const res4 = formatReverseGeocodeAddress(mockPincodeAlandi);
console.log("Test 4 (Pincode 412105 -> Alandi):", res4);
assert.strictEqual(res4, "Alandi, Pune");

// Test 5: Village / Town preservation without broad erasure
const mockVillage = {
  address: {
    road: "Pune-Nashik Highway",
    village: "Chakan",
    county: "Pune",
  },
};
const res5 = formatReverseGeocodeAddress(mockVillage);
console.log("Test 5 (Village Chakan):", res5);
assert.ok(res5.includes("Chakan"));
assert.ok(res5.includes("Pune"));

// Test 6: Empty / fallback handling
const mockEmpty = {
  display_name: "Pune, Maharashtra, India",
  address: {},
};
const res6 = formatReverseGeocodeAddress(mockEmpty);
console.log("Test 6 (Fallback):", res6);
assert.strictEqual(res6, "Pune");

console.log("\nAll 6 Location Address Formatter tests passed successfully!");
