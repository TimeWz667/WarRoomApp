<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">%</th>
            <th scope="col">Public</th>
            <th scope="col">Engaged Pri.</th>
            <th scope="col">Unengaged Pri.</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">Initial Care-Seeking</th>
            <td v-for="csi in Cascade.CSI">{{ parseFloat(csi * 100).toFixed(1) + "%" }}</td>
          </tr>
          <tr>
            <th scope="row">Case Detection</th>
            <td v-for="det in Cascade.Det">{{ parseFloat(det * 100).toFixed(1) + "%" }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-5">
        <h5>Durations</h5>
        <ul>
          <li>Subclinical period: {{parseFloat(Cascade.DurAsym * 12).toFixed(1)+" mo."}}</li>
          <li>Patient delay: {{parseFloat(Cascade.DelayPat * 12).toFixed(1)+" mo."}}</li>
          <li>System delay: {{parseFloat(Cascade.DelaySym * 12).toFixed(1)+" mo."}}</li>
        </ul>
      </div>
      <div class="col-4">
        <h5>Treatment Outcome</h5>
        <ul>
          <li>Completion: {{ parseFloat(Cascade.TxSucc * 100).toFixed(0)+"%"}}</li>
          <li>LTFU/failure: {{ parseFloat(Cascade.TxLTFU * 100).toFixed(0)+"%"}}</li>
          <li>Death: {{ parseFloat(Cascade.TxDie * 100).toFixed(0)+"%"}}</li>
        </ul>
      </div>
      <div class="col-3">
        <h5>Other Indices</h5>
        <ul>
          <li>ARTI: XX%</li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InterIndex",
  props: {
    Cascade: {
      type: Object,
      required: true
    }
  },
  computed: {
    TableHS() {
      return [
        {'_': "Initial Care-Seeking", "Public": this.Cascade.CSI[0], "Engaged Private": this.Cascade.CSI[1],
          "Unengaged Private": this.Cascade.CSI[2]},
        {'_': "Case Detection", "Public": this.Cascade.Det[0], "Engaged Private": this.Cascade.Det[1],
          "Unengaged Private": this.Cascade.Det[2]}
      ]
    }
  },
  data() {
    return {
      Fields: ['_', 'Public', 'Engaged Private', 'Unengaged Private']
    }
  }
}
</script>

<style scoped>

</style>