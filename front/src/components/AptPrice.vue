<template>
  <div class="apt-price">
    <h2>Aresa Apt 101동 105호 Price Chart</h2>
    <div class="year-selector">
      <label for="year-select">Year:</label>
      <select id="year-select" v-model="selectedYear" @change="updateDataByYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <div class="month-selector">
      <label for="month-select">Month:</label>
      <select id="month-select" v-model="selectedMonth" @change="updateDataByMonth">
        <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
      </select>
    </div>
    <div class="value-input">
      <label for="value-input">Value:</label>
      <input type="number" id="value-input" v-model="value">
    </div>
    <button @click="setHistoricalPrice">Submit</button>
    <div class="chart-wrapper">
      <div class="chart">
        <div class="line" style="top: 50%;"></div>
        <div class="dots">
          <div
            v-for="(price, index) in prices"
            :key="index"
            class="dot"
            :style="{
              left: `${index * (1000 / (prices.length - 1))}px`,
              top: `${50 - price * 3}px`
            }"
          >
            <span class="dot-label">{{ price }}억원</span>
          </div>
        </div>
      </div>
    </div>
    <div class="price-list">
      <div v-for="(price, index) in prices" :key="index" class="price-item">
        <span class="price-label">{{ getMonthLabel(index) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      prices: [],
      selectedYear: '',
      selectedMonth: null,
      value: '',
      years: [],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };
  },
  methods: {
    async fetchData() {
      try {
        const storedPrices = localStorage.getItem('prices');
        const storedYear = localStorage.getItem('selectedYear');

        if (storedPrices && storedPrices !== '[]') {
          const parsedPrices = JSON.parse(storedPrices);
          this.prices = Array.isArray(parsedPrices) ? parsedPrices : [];
        } else {
          await this.initializeData();
        }

        if (storedYear) {
          this.selectedYear = parseInt(storedYear);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async initializeData() {
      try {
        const response = await fetch('http://localhost:3000/aresa-api/initialize', {
          method: 'POST',
        });
        const data = await response.json();
        this.prices = data;
        localStorage.setItem('prices', JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    },
    async getHistoricalPrice() {
      try {
        const response = await fetch(`http://localhost:3000/aresa-api/historical_price/1101105/${this.selectedYear}`);
        const data = await response.json();
        this.prices = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getFuturePrice() {
      try {
        const response = await fetch(`http://localhost:3000/aresa-api/future_price/1101105/${this.selectedYear}`);
        const data = await response.json();
        this.prices = data;
      } catch (error) {
        console.error(error);
      }
    },
    async setHistoricalPrice() {
      try {
        const body = {
          aptId: 1101105,
          year: this.selectedYear,
          monthStart: this.selectedMonth + 1,
          value: this.value
        };
        const response = await fetch(`http://localhost:3000/aresa-api/historical_price`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (response.ok) {
          const data = await response.json();
          this.prices = data;
          localStorage.setItem('prices', JSON.stringify(data));
          localStorage.setItem('selectedYear', this.selectedYear);
        } else {
          console.error('Error: Invalid response');
        }
        this.setFuturePrice();
      } catch (error) {
        console.error(error);
      }
    },
    async setFuturePrice() {
      try {
        if (this.selectedYear > new Date().getFullYear()) {
          const body = {
            aptId: 1101105,
            year: this.selectedYear,
            monthStart: this.selectedMonth + 1,
            value: this.value
          };
          const response = await fetch(`http://localhost:3000/aresa-api/future_price`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });

          if (response.ok) {
            const data = await response.json();
            this.prices = data;
            localStorage.setItem('prices', JSON.stringify(data));
            localStorage.setItem('selectedYear', this.selectedYear);
          } else {
            console.error('Error: Invalid response');
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateDataByYear() {
      if (this.selectedYear <= 2023) {
        this.getHistoricalPrice();
      } else {
        this.getFuturePrice();
      }
    },
    getMonthLabel(index) {
      const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
      return months[index];
    },
    populateYears() {
      const startYear = 2000;
      const endYear = 2033;
      for (let year = startYear; year <= endYear; year++) {
        this.years.push(year);
      }
    }
  },
  mounted() {
    this.populateYears();
    this.selectedYear = new Date().getFullYear();
    this.fetchData();
  },
};
</script>
<style scoped>
.apt-price {
  text-align: center;
}

.year-selector {
  margin-bottom: 10px;
}

.month-selector {
  margin-bottom: 10px;
}

.value-input {
  margin-bottom: 10px;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
}

.chart {
  position: relative;
  height: 500px;
  width: 1000px;
  border: 1px solid #ccc;
  margin-top: 50px;
}

.dot {
  position: absolute;
  top: 10%;
  transform: translate(-50%, -50%);
  height: 10px;
  width: 10px;
  background-color: #000;
  border-radius: 5px;
  margin-top: 450px;
}

.dot-label {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  margin-right: 10px;
}

.price-list {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  font-size: 0px;
  font-weight: bold;
}

.price-item {
  display: flex;
  align-items: center;
  margin: 0 34px;
  font-size: 12px;
}

.price-label {
  margin-right: 5px;
  margin-top: 1px;
}

.month-label {
  margin-left: 5px;
}
</style>