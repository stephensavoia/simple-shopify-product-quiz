# Simple Shopify Product Quiz

If you prefer video, watch the setup walkthrough here: [https://youtu.be/RISUJZc86vc](https://youtu.be/RISUJZc86vc)

Simple Shopify Product Quiz is a free Shopify section that helps customers find the best product for their needs. Add it to your theme, connect up to four possible product recommendations, create a few quiz questions, and the section will recommend the product that scores the most points.

This repository includes:

- `avpc-product-quiz.liquid` for your theme's `sections` folder
- `avpc-product-quiz.js` for your theme's `assets` folder

It is intended for merchants, developers, and store owners who want a lightweight product recommendation quiz without installing an app.

## How It Works

The quiz lets you set up to four possible product outcomes.

Each question is added as its own block inside the section. For every answer, you assign the product number that should receive a point:

- `1` gives a point to Product 1
- `2` gives a point to Product 2
- `3` gives a point to Product 3
- `4` gives a point to Product 4

You can also assign more than one product to the same answer by separating numbers with commas. For example:

- `1,2` gives one point to Product 1 and one point to Product 2
- `2,4` gives one point to Product 2 and one point to Product 4

At the end of the quiz, the product with the highest total score is shown as the recommendation.

If there is a tie, the section uses the product order as the tiebreaker. That means Product 1 has the highest priority, then Product 2, then Product 3, then Product 4. So if Product 2 and Product 3 are tied, Product 2 wins.

## Installation

1. Download or copy the files from this repository.
2. In Shopify admin, go to `Online Store` > `Themes`.
3. On your live theme or a duplicate theme, click `...` > `Edit code`.
4. Upload or paste `avpc-product-quiz.liquid` into the `sections` folder.
5. Upload or paste `avpc-product-quiz.js` into the `assets` folder.
6. Save both files.
7. Open the theme customizer and add the `Product quiz` section to the page where you want the quiz to appear.

## Section Setup

After adding the section in the theme editor, work through the settings in this order.

### 1. Add the Intro Content

Set the opening content customers will see before they start the quiz:

- Quiz heading
- Quiz subheading
- Quiz image
- Quiz mobile image

### 2. Choose Your Recommendation Products

The section supports up to four recommendation outcomes:

- Product 1
- Product 2
- Product 3
- Product 4

For each product, you can select:

- the Shopify product itself
- an optional custom title
- an optional custom image

Important: the order of these four products matters. That order is also the tiebreaker order.

Example:

1. Product 1 = Best overall choice
2. Product 2 = Second priority choice
3. Product 3 = Third priority choice
4. Product 4 = Fourth priority choice

If two products finish with the same score, the one with the lower number is selected.

### 3. Add Your Questions

Each quiz question is added as a separate `Question` block.

Inside each block, you can enter:

- the question text
- Response 1 and its product number(s)
- Response 2 and its product number(s)
- Response 3 and its product number(s)

The response fields are what the customer sees. The product field tells the quiz which recommendation should receive a point when that response is selected.

Example question setup:

- Question: `What is your main goal?`
- Response 1: `Hydration`
- Response 1 Product(s): `1`
- Response 2: `Anti-aging`
- Response 2 Product(s): `2`
- Response 3: `Sensitive skin`
- Response 3 Product(s): `3`

Example with shared scoring:

- Response: `I want something gentle and hydrating`
- Product(s): `1,3`

That answer gives one point to Product 1 and one point to Product 3.

### 4. Optional Coupon Settings

If you want, you can also show a coupon code with the recommendation result.

Available options include:

- coupon code
- discount amount
- discount type

The coupon itself must already exist in your Shopify admin.

### 5. Adjust the Styling

The section includes settings for:

- top and bottom padding
- background color
- text color
- accent color
- coupon colors

## Recommended Setup Approach

The easiest way to build a good quiz is:

1. Decide on the four products you want to recommend.
2. Rank them in priority order in case of ties.
3. Write questions that help separate different customer needs or preferences.
4. For each answer, assign the product number that best matches that answer.
5. Test different answer combinations in the storefront to make sure the expected product wins.

## Tips

- Keep questions short and easy to answer.
- Make sure each product can realistically win based on your scoring setup.
- Use the tiebreaker order intentionally. Put your highest-priority fallback recommendation in Product 1.
- If you use comma-separated product numbers, remember that one answer can award points to multiple products at once.

## Included Files

- `avpc-product-quiz.liquid`: the Shopify section file
- `avpc-product-quiz.js`: the quiz logic for scoring, navigation, and result selection

## License / Usage

MIT License

Copyright (c) 2026 Stephen Savoia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
