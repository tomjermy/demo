<template>
  <!-- 主条件 -->
  <div :class="{'condition-content': !isBranch, 'branch-condition': isBranch}">
    <div class="left">
      <el-select v-model="condition.field" class="select" placeholder="请选择" @change="handleSelectField">
        <el-option class="option" v-for="it in [{label: '店铺版本', value: 1}, {label: '风险等级', value: 2}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
      <el-select v-model="condition.operator" class="select" placeholder="请选择">
        <el-option class="option" v-for="it in [{label: '等于', value: '='}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
      <el-select v-model="condition.value" class="select" placeholder="请选择">
        <el-option class="option" v-for="it in [{label: '试用版', value: 1}]" :label="it.label" :value="it.value"></el-option>
      </el-select>
    </div>
    <div class="right">
      <el-icon v-if="!isBranch">
        <Delete />
      </el-icon>
      <el-icon v-else>
        <Close />
      </el-icon>
    </div>
  </div>
</template>

<script lang="js">
import { Delete, Close } from '@element-plus/icons-vue';

export default {
  name: 'RuleConditionItem',
  components: {
    Delete,
    Close
  },
  props: {
    condition: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isBranch() {
      return this.type === 'branch';
    }
  },
  methods: {
    handleSelectField(value) {
      console.log('----', value)
      this.$emit('update:condition', value);
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-content {
  width: 720px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

.branch-condition {
  width: 670px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px 0;
}

.left {

  .select {
    width: 180px;
    background-color: #f7f7f7;
    padding: 0 10px;
  }
}

.right {
  margin: 0 10px;
  color: #7f7f7f;
}

.right:hover {
  color: #343434;
}
</style>