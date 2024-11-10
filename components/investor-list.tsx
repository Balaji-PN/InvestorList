"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvestorRow } from "@/components/investor-row";
import { data as investors } from "@/lib/data";

// Get unique locations and fund types
const locations = [...new Set(investors.map((investor) => investor.Location))];
const fundTypes = [
  ...new Set(investors.map((investor) => investor["Fund Type"])),
];

export function InvestorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [fundTypeFilter, setFundTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  // Filter and sort data
  let filteredData = investors.filter((investor) =>
    investor["Investor Name"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (locationFilter !== "all") {
    filteredData = filteredData.filter(
      (investor) => investor.Location === locationFilter
    );
  }

  if (fundTypeFilter !== "all") {
    filteredData = filteredData.filter(
      (investor) => investor["Fund Type"] === fundTypeFilter
    );
  }

  // Sort data
  switch (sortBy) {
    case "investments":
      filteredData.sort(
        (a, b) =>
          Number(b["Number of Investments"]) -
          Number(a["Number of Investments"])
      );
      break;
    case "exits":
      filteredData.sort(
        (a, b) => Number(b["Number of Exits"]) - Number(a["Number of Exits"])
      );
      break;
    case "name":
      filteredData.sort((a, b) =>
        a["Investor Name"].localeCompare(b["Investor Name"])
      );
      break;
    case "year":
      filteredData.sort(
        (a, b) => Number(b["Founding Year"]) - Number(a["Founding Year"])
      );
      break;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Search investors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fundTypeFilter} onValueChange={setFundTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Fund Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fund Types</SelectItem>
              {fundTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="investments">Number of Investments</SelectItem>
              <SelectItem value="exits">Number of Exits</SelectItem>
              <SelectItem value="name">Company Name</SelectItem>
              <SelectItem value="year">Founding Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((investor) => (
          <InvestorRow key={investor["S.no"]} investor={investor} />
        ))}
      </div>
    </div>
  );
}
