# Project: BOM Recipe Calculator - Development Plan

## Project Overview

This document outlines the development plan for expanding the BOM Recipe
Calculator library, focusing on production planning, inventory management, and
reporting features.

## Goals

- Provide tools for production planning and control
- Implement inventory management for products and ingredients
- Generate detailed reports on production, sales, and inventory
- Improve user experience and system automation

## Target Audience

- Manufacturers
- Production planners
- Inventory managers
- Business owners

## Versioning

The development will be released in phases, with each version adding new
functionality:

- v0.5.0 - Production Planning and Inventory Control
- v0.6.0 - Production Reports and Analysis
- v0.7.0 - Enhancements and Automation

## TODO List

### v0.5.0 - Production Planning and Inventory Control

#### 1. Production Planning

- [x] 1.1 Create production planning feature (recipes to be produced)
- [x] 1.1.1 add "id" and optional "name" to each IProductionPlanEntry
- [ ] 1.2 Implement maximum and minimum recipe quantities (production limits)
- [x] 1.3 List production plans and history of what has been produced
- [ ] 1.4 Implement printing support for production assistance
- [ ] 1.5 Enable editing and deleting production plans
- [ ] 1.6 Allow input of total average monthly sales
- [ ] 1.7 Create an alert system for products with low turnover

#### 2. Inventory Control

- [ ] 2.3 Relate sales to recipe consumption for future projections
- [ ] 2.4 Relate ingredients to recipe consumption for future projections
- [ ] 2.5 Relate ingredients to product consumption for future projections

---

### v0.6.0 - Production Reports and Analysis

#### 3. Production Reports

- [ ] 3.1 Record what was produced and what was used
- [ ] 3.2 Aggregate sales data into recipes and products used
- [ ] 3.3 Compare planned vs. actual production
- [ ] 3.4 Generate sales report by product and recipe
- [ ] 3.5 Generate ingredient consumption report by recipe and product

#### 4. Ingredient Usage Optimization

- [ ] 4.1 Display what was manufactured a time period
  - [ ] 4.1.1 Show total of products manufactured
  - [ ] 4.1.2 Show products used, exploded in their trees and accumulated. For
        example, if I made 33 hamburgers then how much cheese was consumed. Show
        the total of ingredients consumed for the time period, allow filtering
        by category.

- [ ] 4.2 Generate alerts for purchase needs or production adjustments
- [ ] 4.3 Create reports on production efficiency and ingredient consumption
- [ ] 4.4 Implement charts and visualizations for data analysis

---

### v0.7.0 - Enhancements and Automation

#### 7. Automation and Intelligence

- [ ] 7.1 Automatically suggest a production plan based on sales and inventory
- [ ] 7.2 Generate low stock alerts based on projected consumption
- [ ] 7.3 Implement demand forecasting using historical data
- [ ] 7.4 Create a feedback system to improve forecasts based on actual data
- [ ] 7.5 Implement a machine learning system to optimize production and
      inventory planning
