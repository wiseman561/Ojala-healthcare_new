module "redis" {
  source = "terraform-aws-modules/elasticache/aws"
  version = "1.6.0"
  
  cluster_id      = "ojala-redis-${var.environment}"
  engine          = "redis"
  engine_version  = "6.x"
  port            = 6379
  num_cache_nodes = var.environment == "production" ? 2 : 1
  node_type       = var.redis_node_type
  
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]
  
  maintenance_window       = "tue:03:00-tue:04:00"
  snapshot_window          = "04:00-05:00"
  apply_immediately        = true
  auto_minor_version_upgrade = true
  
  tags = {
    Environment = var.environment
    Project     = "ojala-healthcare"
    Terraform   = "true"
  }
}
