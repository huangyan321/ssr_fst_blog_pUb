<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :small="small"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '../../utils/scroll-to'
import { mapMutations } from 'vuex'
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [2, 5, 10, 15]
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next,->'
    },
    background: {
      type: Boolean,
      default: false
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.triggerPage({ pageNum: val })
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.triggerPage({ pageSize: val })
      }
    }
  },
  methods: {
    ...mapMutations('list', {
      triggerPage: 'TRIGGER_PAGE'
    }),
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination')
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
