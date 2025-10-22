// sleep.mjs
export class Scheduler {
  constructor(containerId, audioId) {
    this.audioElement = document.getElementById(audioId);
    this.container = document.getElementById(containerId);
    this.scheduleID = -1;
    
    if (!this.audioElement || !this.container) {
      console.error('Could not find audio or container element');
      return;
    }
    
    this.renderUI();
    this.setupEventListeners();
  }
  
  renderUI() {
    this.container.innerHTML = `
      <p> 
        <input type="checkbox" id="mySchedule" name="schedule" value="schedule">
        <label for="mySchedule"><span id='sleep'>45</span> min &rarr; 💤</label>
        <input type="range" min="5" max="75" value="45" step="5" id="stop">
      </p>
    `;
    
    this.stopInput = this.container.querySelector('#stop');
    this.sleepDisplay = this.container.querySelector('#sleep');
    this.checkbox = this.container.querySelector('#mySchedule');
  }
  
  setupEventListeners() {
    this.stopInput.addEventListener('change', () => {
      this.sleepDisplay.innerText = this.stopInput.value;
    });
    
    this.checkbox.addEventListener('change', () => {
      if (this.checkbox.checked) {
        this.scheduleStop(this.stopInput.value);
      } else {
        this.clearSchedule();
      }
    });
  }
  
  scheduleStop(duration) {
    this.clearSchedule(); // Clear any existing timeout
    
    this.scheduleID = setTimeout(() => {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.checkbox.checked = false;
      this.scheduleID = -1;
    }, duration * 60 * 1000);
  }
  
  clearSchedule() {
    if (this.scheduleID !== -1) {
      clearTimeout(this.scheduleID);
      this.scheduleID = -1;
    }
  }
  
  destroy() {
    this.clearSchedule();
    this.container.innerHTML = '';
  }
}
